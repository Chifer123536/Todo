import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { TwoFactorDto } from './dto/two-factor.dto';
import { UserService } from '@/user/user.service';
import { AuthMethod } from '@/shared/enums';
import { User, UserDocument } from '@/schemas/user.schema';
import { Account, AccountDocument } from '@/schemas/account.schema';
import { Request, Response } from 'express';
import { verify } from 'argon2';
import { ConfigService } from '@nestjs/config';
import { ProviderService } from './provider/provider.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmailConfirmationService } from './email-confirmation/email-confirmation.service';
import { TwoFactorAuthService } from './two-factor-auth/two-factor-auth.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Account.name)
    private readonly accountModel: Model<AccountDocument>,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly providerService: ProviderService,
    private readonly emailConfirmationService: EmailConfirmationService,
    private readonly twoFactorAuthService: TwoFactorAuthService
  ) {}

  public async register(req: Request, dto: RegisterDto) {
    const isExists = await this.userService.findByEmail(dto.email);
    if (isExists) {
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

    await this.emailConfirmationService.sendVerificationToken(newUser.email);

    return {
      message: 'User registered successfully. Please, confirm your email.'
    };
  }

  public async loginStepOne(req: Request, dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user || !user.password) {
      throw new NotFoundException('User not found');
    }

    const isValidPassword = await verify(user.password, dto.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isVerified) {
      await this.emailConfirmationService.sendVerificationToken(user.email);
      throw new UnauthorizedException(
        'User is not verified. Please, confirm your email.'
      );
    }

    if (user.isTwoFactorEnabled) {
      await this.twoFactorAuthService.sendTwoFactorToken(user.email);
      req.session.twoFactorUserId = user.id;
      req.session.authState = 'pending2FA';
      await req.session.save();
      return { message: 'Look at your email for the code on two-factor auth.' };
    }

    return await this.saveSession(req, user);
  }

  public async confirmTwoFactorCode(req: Request, dto: TwoFactorDto) {
    const sessionUserId = req.session.twoFactorUserId;
    if (!sessionUserId) {
      throw new UnauthorizedException('Session expired. Please login again.');
    }
    const user = await this.userService.findById(sessionUserId);
    if (!user || !user.isTwoFactorEnabled) {
      throw new UnauthorizedException('Two-factor authentication not enabled.');
    }

    await this.twoFactorAuthService.validateTwoFactorToken(
      user.email,
      dto.code
    );

    delete req.session.twoFactorUserId;
    req.session.authState = 'authenticated';
    return await this.saveSession(req, user);
  }

  public async extractProfileFromCode(
    req: Request,
    provider: string,
    code: string
  ) {
    const providerInstance = this.providerService.findByService(provider);
    const profile = await providerInstance.findUserByCode(code);

    let account = await this.accountModel.findOne({
      id: profile.id,
      provider: profile.provider
    });

    let user: UserDocument;
    if (account) {
      user = await this.userModel.findById(account.userId);
      if (!user) {
        throw new NotFoundException('User linked to this account not found');
      }
    } else {
      user = await this.userModel.findOne({ email: profile.email });
      if (!user) {
        user = await this.userService.create(
          profile.email,
          '',
          profile.name,
          profile.picture,
          AuthMethod[profile.provider.toUpperCase()],
          true
        );
      }
      account = await this.accountModel.create({
        userId: user.id,
        type: 'oauth',
        provider: profile.provider,
        accessToken: profile.access_token,
        refreshToken: profile.refresh_token,
        expiresAt: profile.expires_at
      });
    }

    return await this.saveSession(req, user);
  }

  public async resendTwoFactorToken(req: Request) {
    const sessionUserId = req.session.twoFactorUserId;
    if (!sessionUserId) {
      throw new UnauthorizedException('Session expired. Please login again.');
    }
    const user = await this.userService.findById(sessionUserId);
    if (!user || !user.isTwoFactorEnabled) {
      throw new UnauthorizedException('Two-factor authentication not enabled.');
    }
    await this.twoFactorAuthService.sendTwoFactorToken(user.email);
    return {
      message: 'Verification code has been resent to your email.'
    };
  }

  public async logout(req: Request, res: Response): Promise<void> {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          return reject(new InternalServerErrorException('Failed to logout'));
        }

        const sessionName =
          this.configService.getOrThrow<string>('SESSION_NAME');
        const sessionDomain = this.configService.get<string>('SESSION_DOMAIN');
        const sessionHttpOnly =
          this.configService.get<string>('SESSION_HTTP_ONLY') === 'true';
        const isProd =
          this.configService.get<string>('NODE_ENV') === 'production';
        const sessionSecure = isProd;
        const sessionSameSite: 'lax' | 'none' = isProd ? 'none' : 'lax';

        const cookieOptions = {
          path: '/',
          httpOnly: sessionHttpOnly,
          secure: sessionSecure,
          sameSite: sessionSameSite,
          ...(sessionDomain ? { domain: sessionDomain } : {})
        };

        res.clearCookie(sessionName, cookieOptions);
        res.clearCookie('authState', {
          path: '/',
          secure: sessionSecure,
          sameSite: sessionSameSite,
          ...(sessionDomain ? { domain: sessionDomain } : {})
        });

        resolve();
      });
    });
  }

  public async saveSession(req: Request, user: User) {
    req.session.userId = user.id;
    req.session.authState = req.session.authState ?? 'authenticated';
    return new Promise<{ user: User }>((resolve, reject) => {
      req.session.save((err) => {
        if (err) {
          return reject(
            new InternalServerErrorException('Failed to save session')
          );
        }
        resolve({ user });
      });
    });
  }
}

/*
  - AuthService отвечает за регистрацию, вход, двухфакторную аутентификацию, OAuth и логаут.
  - Использует Mongoose-модели User и Account для операций с БД.
  - При регистрации: проверяет существование, создаёт пользователя, отправляет письмо подтверждения.
  - При логине: проверяет пароль, верификацию, при включённой 2FA отправляет код, устанавливает authState='pending2FA'.
    При подтверждении 2FA сохраняет сессию как 'authenticated'.
  - Поддерживает OAuth: извлекает профиль, связывает или создаёт пользователя и аккаунт, сохраняет сессию.
  - logout: уничтожает сессию и очищает cookie по настройкам.
  - saveSession: сохраняет userId и authState в сессии.
*/
