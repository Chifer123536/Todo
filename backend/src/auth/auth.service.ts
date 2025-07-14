import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  Logger
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
  private readonly logger = new Logger(AuthService.name);
  private readonly isDev: boolean;

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Account.name)
    private readonly accountModel: Model<AccountDocument>,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly providerService: ProviderService,
    private readonly emailConfirmationService: EmailConfirmationService,
    private readonly twoFactorAuthService: TwoFactorAuthService
  ) {
    // Определяем, режим ли разработки. Если NODE_ENV !== 'production', включаем debug-логи.
    this.isDev = this.configService.get<string>('NODE_ENV') !== 'production';
    if (this.isDev) {
      this.logger.debug('AuthService initialized in development mode');
    }
  }

  public async register(req: Request, dto: RegisterDto) {
    if (this.isDev) {
      this.logger.debug('register() called');
      this.logger.debug(`Request body: ${JSON.stringify(req.body)}`);
      this.logger.debug(
        `Session before register: ${JSON.stringify(req.session)}`
      );
    }

    const isExists = await this.userService.findByEmail(dto.email);
    if (this.isDev) {
      this.logger.debug(`existing user check for ${dto.email} → ${!!isExists}`);
    }
    if (isExists) {
      this.logger.warn(`Attempt to register existing email: ${dto.email}`);
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
    if (this.isDev) {
      this.logger.debug(`New user created: ${newUser.email}`);
    }

    await this.emailConfirmationService.sendVerificationToken(newUser.email);
    if (this.isDev) {
      this.logger.debug(`Sent email confirmation to: ${newUser.email}`);
      this.logger.debug(
        `Session after register: ${JSON.stringify(req.session)}`
      );
    }

    return {
      message: 'User registered successfully. Please, confirm your email.'
    };
  }

  public async loginStepOne(req: Request, dto: LoginDto) {
    if (this.isDev) {
      this.logger.debug(`Session before login: ${JSON.stringify(req.session)}`);
    }

    // Удаляем старую сессию
    await new Promise<void>((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) return reject(err);
        if (this.isDev) this.logger.debug('Old session destroyed');
        resolve();
      });
    });

    await new Promise<void>((resolve, reject) => {
      req.session.regenerate((err) => {
        if (err) return reject(err);
        if (this.isDev) this.logger.debug('New session regenerated');
        resolve();
      });
    });

    const user = await this.userService.findByEmail(dto.email);
    if (this.isDev) {
      this.logger.debug(`found user: ${user?.email}`);
    }
    if (!user || !user.password) {
      this.logger.warn(
        `user not found or has no password for email: ${dto.email}`
      );
      throw new NotFoundException('User not found');
    }

    const isValidPassword = await verify(user.password, dto.password);
    if (this.isDev) {
      this.logger.debug(`isValidPassword: ${isValidPassword}`);
    }
    if (!isValidPassword) {
      this.logger.warn(`Invalid credentials for email: ${dto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isVerified) {
      if (this.isDev) {
        this.logger.debug(
          `User not verified, sending verification token to: ${user.email}`
        );
      }
      await this.emailConfirmationService.sendVerificationToken(user.email);
      throw new UnauthorizedException(
        'User is not verified. Please, confirm your email.'
      );
    }

    if (user.isTwoFactorEnabled) {
      if (this.isDev) {
        this.logger.debug(`Two-Factor is enabled for: ${user.email}`);
      }
      await this.twoFactorAuthService.sendTwoFactorToken(user.email);
      req.session.twoFactorUserId = user.id;
      req.session.authState = 'pending2FA';
      await req.session.save();
      if (this.isDev) {
        this.logger.debug(
          `Session saved for 2FA step: ${JSON.stringify(req.session)}`
        );
      }
      return { message: 'Look at your email for the code on two-factor auth.' };
    }

    const result = await this.saveSession(req, user);
    if (this.isDev) {
      this.logger.debug(
        `Session after loginStepOne: ${JSON.stringify(req.session)}`
      );
    }
    return result;
  }

  public async confirmTwoFactorCode(req: Request, dto: TwoFactorDto) {
    if (this.isDev) {
      this.logger.debug('confirmTwoFactorCode() called');
      this.logger.debug(`DTO: ${JSON.stringify(dto)}`);
      this.logger.debug(
        `Session before confirm: ${JSON.stringify(req.session)}`
      );
    }

    const sessionUserId = req.session.twoFactorUserId;
    if (!sessionUserId) {
      this.logger.warn('Session expired before 2FA confirmation');
      throw new UnauthorizedException('Session expired. Please login again.');
    }
    const user = await this.userService.findById(sessionUserId);
    if (!user || !user.isTwoFactorEnabled) {
      this.logger.warn('Two-factor auth not enabled or user missing');
      throw new UnauthorizedException('Two-factor authentication not enabled.');
    }

    if (this.isDev) {
      this.logger.debug(`Validating 2FA code for: ${user.email}`);
    }
    await this.twoFactorAuthService.validateTwoFactorToken(
      user.email,
      dto.code
    );
    if (this.isDev) {
      this.logger.debug(`2FA code is valid for: ${user.email}`);
    }

    delete req.session.twoFactorUserId;
    req.session.authState = 'authenticated';
    const result = await this.saveSession(req, user);
    if (this.isDev) {
      this.logger.debug(
        `Session after confirmTwoFactorCode: ${JSON.stringify(req.session)}`
      );
    }
    return result;
  }

  public async extractProfileFromCode(
    req: Request,
    provider: string,
    code: string
  ) {
    if (this.isDev) {
      this.logger.debug('extractProfileFromCode called');
      this.logger.debug(`Provider: ${provider}, Code: ${code}`);
      this.logger.debug(
        `Session before extract: ${JSON.stringify(req.session)}`
      );
    }
    const providerInstance = this.providerService.findByService(provider);
    const profile = await providerInstance.findUserByCode(code);
    if (this.isDev) {
      this.logger.debug(`provider profile: ${JSON.stringify(profile)}`);
    }
    let account = await this.accountModel.findOne({
      id: profile.id,
      provider: profile.provider
    });
    if (this.isDev) {
      this.logger.debug(
        `existing OAuth account: ${account ? account.id : 'none'}`
      );
    }
    let user: UserDocument;
    if (account) {
      if (this.isDev) {
        this.logger.debug(`Linking to existing user ID: ${account.userId}`);
      }
      user = await this.userModel.findById(account.userId);
      if (!user) {
        this.logger.error(`Linked user missing for ID: ${account.userId}`);
        throw new NotFoundException('User linked to this account not found');
      }
    } else {
      if (this.isDev) {
        this.logger.debug(
          `No OAuth account, looking up user by email: ${profile.email}`
        );
      }
      user = await this.userModel.findOne({ email: profile.email });
      if (!user) {
        if (this.isDev) {
          this.logger.debug(
            `Creating new OAuth user for email: ${profile.email}`
          );
        }
        user = await this.userService.create(
          profile.email,
          '',
          profile.name,
          profile.picture,
          AuthMethod[profile.provider.toUpperCase()],
          true
        );
      }
      if (this.isDev) {
        this.logger.debug(`Creating OAuth account for user: ${user.email}`);
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
    const result = await this.saveSession(req, user);
    if (this.isDev) {
      this.logger.debug(
        `Session after extractProfileFromCode: ${JSON.stringify(req.session)}`
      );
    }
    return result;
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
    if (this.isDev) {
      this.logger.debug(
        `logout() called, session before destroy: ${JSON.stringify(req.session)}`
      );
      this.logger.debug(`Headers.cookie before logout: ${req.headers.cookie}`);
    }

    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          this.logger.error('Error destroying session:', err);
          return reject(new InternalServerErrorException('Failed to logout'));
        }

        if (this.isDev) {
          this.logger.debug('Session destroyed successfully');
          this.logger.debug(
            `Session after destroy: ${JSON.stringify(req.session)}`
          );
        }

        const sessionName =
          this.configService.getOrThrow<string>('SESSION_NAME');
        const sessionHttpOnly =
          this.configService.get<string>('SESSION_HTTP_ONLY') === 'true';
        const sessionDomain = this.configService.get<string>('SESSION_DOMAIN');

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

        if (this.isDev) {
          this.logger.debug('Cleared cookies:', {
            session: { name: sessionName, options: cookieOptions },
            authState: {
              name: 'authState',
              options: {
                path: '/',
                secure: sessionSecure,
                sameSite: sessionSameSite,
                ...(sessionDomain ? { domain: sessionDomain } : {})
              }
            }
          });
        }

        resolve();
      });
    });
  }

  public async saveSession(req: Request, user: User) {
    if (this.isDev) {
      this.logger.debug(`Saving session for user: ${user.email}`);
      this.logger.debug(
        `Session before saving: ${JSON.stringify(req.session)}`
      );
    }
    req.session.userId = user.id;
    req.session.authState = req.session.authState ?? 'authenticated';
    return new Promise<{ user: User }>((resolve, reject) => {
      req.session.save((err) => {
        if (err) {
          this.logger.error('Error saving session:', err);
          return reject(
            new InternalServerErrorException('Failed to save session')
          );
        }
        if (this.isDev) {
          this.logger.debug(
            `Session saved successfully for user: ${user.email}`
          );
          this.logger.debug(
            `Session after saving: ${JSON.stringify(req.session)}`
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
  - Логирование через Nest Logger:
      • вызовы this.logger.debug(...) обёрнуты через if(this.isDev), где isDev=true только если NODE_ENV!=='production'.
      • Таким образом, в production-режиме debug-логи не выполняются.
*/
