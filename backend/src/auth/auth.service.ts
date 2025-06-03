import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '@/user/user.service';
import { AuthMethod } from '@/shared/enums';
import { User, UserDocument } from '@/schemas/user.schema';
import { Account, AccountDocument } from '@/schemas/account.schema';
import { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { verify } from 'argon2';
import { ConfigService } from '@nestjs/config';
import { ProviderService } from './provider/provider.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmailConfirmationService } from './email-confirmation/email-confirmation.service';
import { TwoFactorAuthService } from './two-factor-auth/two-factor-auth.service';

@Injectable()
export class AuthService {
  public constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Account.name)
    private readonly accountModel: Model<AccountDocument>,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly providerService: ProviderService,
    private readonly emailConfirmationService: EmailConfirmationService,
    private readonly twoFactorAuthService: TwoFactorAuthService
  ) {
    // Логируем ключевые ENV-переменные при инициализации AuthService
    console.log('>>> [AuthService] ENV snapshot:');
    [
      'SESSION_NAME',
      'SESSION_DOMAIN',
      'SESSION_SECURE',
      'SESSION_HTTP_ONLY',
      'SESSION_COOKIE_SAME_SITE',
      'SESSION_MAX_AGE'
    ].forEach((key) => {
      console.log(`    ${key} =`, this.configService.get<string>(key));
    });
  }

  public async register(req: Request, dto: RegisterDto) {
    console.log('>>> [AuthService] register() called with DTO:', dto);
    const isExists = await this.userService.findByEmail(dto.email);
    console.log(
      '>>> [AuthService] existing user check for',
      dto.email,
      '→',
      !!isExists
    );

    if (isExists) {
      console.warn(
        '>>> [AuthService] Attempt to register existing email:',
        dto.email
      );
      throw new ConflictException('A user with this email already exists');
    }

    const newUser = await this.userService.create(
      dto.email,
      dto.password,
      dto.name,
      '',
      AuthMethod.CREDENTIALS,
      false
    );
    console.log('>>> [AuthService] New user created:', newUser.email);

    await this.emailConfirmationService.sendVerificationToken(newUser.email);
    console.log('>>> [AuthService] Sent email confirmation to:', newUser.email);

    return {
      message: 'User registered successfully. Please, confirm your email.'
    };
  }

  public async login(req: Request, dto: LoginDto) {
    console.log('>>> [AuthService] login() called with DTO:', dto);

    const user = await this.userService.findByEmail(dto.email);
    console.log('>>> [AuthService] found user:', user?.email);

    if (!user || !user.password) {
      console.warn(
        '>>> [AuthService] user not found or has no password for email:',
        dto.email
      );
      throw new NotFoundException('User not found');
    }

    const isValidPassword = await verify(user.password, dto.password);
    console.log('>>> [AuthService] isValidPassword:', isValidPassword);

    if (!isValidPassword) {
      console.warn(
        '>>> [AuthService] Invalid credentials for email:',
        dto.email
      );
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isVerified) {
      console.log(
        '>>> [AuthService] User not verified, sending verification token to:',
        user.email
      );
      await this.emailConfirmationService.sendVerificationToken(user.email);
      throw new UnauthorizedException(
        'User is not verified. Please, confirm your email.'
      );
    }

    if (user.isTwoFactorEnabled) {
      console.log('>>> [AuthService] Two-Factor is enabled for:', user.email);

      if (!dto.code) {
        console.log(
          '>>> [AuthService] No 2FA code provided, sending 2FA token to:',
          user.email
        );
        await this.twoFactorAuthService.sendTwoFactorToken(user.email);
        return {
          message: 'Look at your email for the code on two-factor auth.'
        };
      }

      console.log('>>> [AuthService] Validating 2FA code for:', user.email);
      await this.twoFactorAuthService.validateTwoFactorToken(
        user.email,
        dto.code
      );
      console.log('>>> [AuthService] 2FA code is valid for:', user.email);
    }

    return this.saveSession(req, user);
  }

  public async extractProfileFromCode(
    req: Request,
    provider: string,
    code: string
  ) {
    console.log('>>> [AuthService] extractProfileFromCode called with:', {
      provider,
      code
    });

    const providerInstance = this.providerService.findByService(provider);
    const profile = await providerInstance.findUserByCode(code);
    console.log('>>> [AuthService] provider profile:', profile);

    let account = await this.accountModel.findOne({
      id: profile.id,
      provider: profile.provider
    });
    console.log(
      '>>> [AuthService] existing OAuth account query result:',
      account
    );

    let user: UserDocument | null = null;

    if (account) {
      console.log(
        '>>> [AuthService] Found existing account, fetching user by ID:',
        account.userId
      );
      user = await this.userModel.findById(account.userId);
      if (!user) {
        console.warn(
          '>>> [AuthService] Account exists but user missing for ID:',
          account.userId
        );
        throw new NotFoundException('User linked to this account not found');
      }
      console.log('>>> [AuthService] Linked user found:', user.email);
    } else {
      console.log(
        '>>> [AuthService] No OAuth account found, looking up user by email:',
        profile.email
      );
      user = await this.userModel.findOne({ email: profile.email });

      if (!user) {
        console.log(
          '>>> [AuthService] No user found with that email, creating new user:',
          profile.email
        );
        user = await this.userService.create(
          profile.email,
          '',
          profile.name,
          profile.picture,
          AuthMethod[profile.provider.toUpperCase()],
          true
        );
        console.log('>>> [AuthService] New OAuth user created:', user.email);
      } else {
        console.log(
          '>>> [AuthService] Found existing user by email:',
          user.email
        );
      }

      console.log(
        '>>> [AuthService] Creating new OAuth account for user:',
        user.email
      );
      account = await this.accountModel.create({
        userId: user.id,
        type: 'oauth',
        provider: profile.provider,
        accessToken: profile.access_token,
        refreshToken: profile.refresh_token,
        expiresAt: profile.expires_at
      });
      console.log('>>> [AuthService] New OAuth account created:', account);
    }

    return this.saveSession(req, user);
  }

  public async logout(req: Request, res: Response): Promise<void> {
    console.log(
      '>>> [AuthService] logout() called, session before destroy:',
      req.session
    );

    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          console.error('<<< [AuthService] Error destroying session:', err);
          return reject(new InternalServerErrorException('Failed to logout'));
        }
        console.log(
          '<<< [AuthService] Session destroyed successfully for user'
        );
        res.clearCookie(this.configService.getOrThrow<string>('SESSION_NAME'));
        console.log(
          '<<< [AuthService] Cleared cookie:',
          this.configService.getOrThrow<string>('SESSION_NAME')
        );
        resolve();
      });
    });
  }

  public async saveSession(req: Request, user: User) {
    console.log('>>> [AuthService] Saving session for user:', user.email);

    return new Promise((resolve, reject) => {
      req.session.userId = user.id;
      console.log(
        '>>> [AuthService] req.session.userId set to:',
        req.session.userId
      );

      req.session.save((err) => {
        if (err) {
          console.error('<<< [AuthService] Error saving session:', err);
          return reject(
            new InternalServerErrorException('Failed to save session')
          );
        }
        console.log(
          '<<< [AuthService] Session saved successfully, user:',
          user.email
        );
        resolve({ user });
      });
    });
  }
}
