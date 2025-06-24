import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  Logger
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { TwoFactorDto } from './dto/two-factor.dto';
import { Recaptcha } from '@nestlab/google-recaptcha';
import { AuthProviderGuard } from './guards/provider.guard';
import { ConfigService } from '@nestjs/config';
import { ProviderService } from './provider/provider.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  private readonly isDev: boolean;

  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly providerService: ProviderService
  ) {
    // Флаг режима: debug-логи только когда NODE_ENV !== 'production'.
    this.isDev = this.configService.get<string>('NODE_ENV') !== 'production';
    if (this.isDev) {
      this.logger.debug('AuthController initialized in development mode');
      const allowed = this.configService.get<string>('ALLOWED_ORIGIN');
      this.logger.debug(`ALLOWED_ORIGIN = ${allowed}`);
    }
  }

  @Recaptcha()
  @Post('register')
  @HttpCode(HttpStatus.OK)
  public async register(@Req() req: Request, @Body() dto: RegisterDto) {
    if (this.isDev) {
      this.logger.debug('=== [REGISTER] REQUEST START ===');
      this.logger.debug(`[REGISTER] Headers: ${JSON.stringify(req.headers)}`);
      this.logger.debug(`[REGISTER] Body (DTO): ${JSON.stringify(dto)}`);
      this.logger.debug(
        `[REGISTER] Session before: ${JSON.stringify(req.session)}`
      );
    }

    try {
      const result = await this.authService.register(req, dto);

      // Сохраняем сессию
      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) {
            this.logger.error('[REGISTER] Session save error:', err);
            return reject(err);
          }
          if (this.isDev) {
            this.logger.debug('[REGISTER] Session saved successfully');
          }
          resolve();
        });
      });

      if (this.isDev) {
        this.logger.debug(
          `[REGISTER] Session after: ${JSON.stringify(req.session)}`
        );
        this.logger.debug(`[REGISTER] Result: ${JSON.stringify(result)}`);
        this.logger.debug('=== [REGISTER] REQUEST END ===');
      }
      return result;
    } catch (error) {
      this.logger.error('[REGISTER] Error:', error);
      if (this.isDev) {
        this.logger.debug('=== [REGISTER] REQUEST END with Error ===');
      }
      throw error;
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(
    @Req() req: Request,
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    if (this.isDev) {
      this.logger.debug('=== [LOGIN] REQUEST START ===');
      this.logger.debug(`[LOGIN] Headers: ${JSON.stringify(req.headers)}`);
      this.logger.debug(`[LOGIN] Body (DTO): ${JSON.stringify(dto)}`);
      this.logger.debug(
        `[LOGIN] Session before: ${JSON.stringify(req.session)}`
      );
    }

    try {
      const result = await this.authService.loginStepOne(req, dto);

      const state =
        req.session.authState === 'pending2FA' ? 'pending2FA' : 'authenticated';
      res.cookie('authState', state, {
        path: '/',
        httpOnly: false,
        secure: this.configService.get<string>('SESSION_SECURE') === 'true',
        sameSite: 'none',
        domain: '.todolist.chifer123536.ru',
        maxAge:
          state === 'pending2FA' ? 10 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000
      });

      if (this.isDev) {
        this.logger.debug(
          `[LOGIN] Session after: ${JSON.stringify(req.session)}`
        );
        this.logger.debug(`[LOGIN] authState set to: ${state}`);
        this.logger.debug(`[LOGIN] Result: ${JSON.stringify(result)}`);
        this.logger.debug('=== [LOGIN] REQUEST END ===');
      }
      return result;
    } catch (error) {
      this.logger.error('[LOGIN] Error:', error);
      if (this.isDev) {
        this.logger.debug('=== [LOGIN] REQUEST END with Error ===');
      }
      throw error;
    }
  }

  @Post('login/2fa')
  @HttpCode(HttpStatus.OK)
  public async login2fa(
    @Req() req: Request,
    @Body() dto: TwoFactorDto,
    @Res({ passthrough: true }) res: Response
  ) {
    if (this.isDev) {
      this.logger.debug('=== [LOGIN/2FA] REQUEST START ===');
      this.logger.debug(`[LOGIN/2FA] Body (DTO): ${JSON.stringify(dto)}`);
      this.logger.debug(
        `[LOGIN/2FA] Session before: ${JSON.stringify(req.session)}`
      );
    }

    try {
      const result = await this.authService.confirmTwoFactorCode(req, dto);

      res.cookie('authState', 'authenticated', {
        path: '/',
        httpOnly: false,
        secure: this.configService.get<string>('SESSION_SECURE') === 'true',
        sameSite: 'none',
        domain: '.todolist.chifer123536.ru',
        maxAge: 30 * 24 * 60 * 60 * 1000
      });

      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) {
            this.logger.error('[LOGIN/2FA] Session save error:', err);
            return reject(err);
          }
          if (this.isDev) {
            this.logger.debug('[LOGIN/2FA] Session saved successfully');
          }
          resolve();
        });
      });

      if (this.isDev) {
        this.logger.debug(
          `[LOGIN/2FA] Session after: ${JSON.stringify(req.session)}`
        );
        this.logger.debug(`[LOGIN/2FA] Result: ${JSON.stringify(result)}`);
        this.logger.debug('=== [LOGIN/2FA] REQUEST END ===');
      }
      return result;
    } catch (error) {
      this.logger.error('[LOGIN/2FA] Error:', error);
      if (this.isDev) {
        this.logger.debug('=== [LOGIN/2FA] REQUEST END with Error ===');
      }
      throw error;
    }
  }

  @Post('2fa/resend')
  @HttpCode(HttpStatus.OK)
  public async resendTwoFactorToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    if (this.isDev) {
      this.logger.debug('=== [2FA RESEND] REQUEST START ===');
      this.logger.debug(
        `[2FA RESEND] Session before: ${JSON.stringify(req.session)}`
      );
    }

    try {
      const result = await this.authService.resendTwoFactorToken(req);

      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) {
            this.logger.error('[2FA RESEND] Session save error:', err);
            return reject(err);
          }
          if (this.isDev) {
            this.logger.debug('[2FA RESEND] Session saved successfully');
          }
          resolve();
        });
      });

      if (this.isDev) {
        this.logger.debug(
          `[2FA RESEND] Session after: ${JSON.stringify(req.session)}`
        );
        this.logger.debug(`[2FA RESEND] Result: ${JSON.stringify(result)}`);
        this.logger.debug('=== [2FA RESEND] REQUEST END ===');
      }
      return result;
    } catch (error) {
      this.logger.error('[2FA RESEND] Error:', error);
      if (this.isDev) {
        this.logger.debug('=== [2FA RESEND] REQUEST END with Error ===');
      }
      throw error;
    }
  }

  @Get('/oauth/callback/:provider')
  @UseGuards(AuthProviderGuard)
  public async callback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Query('code') code: string,
    @Param('provider') provider: string
  ) {
    if (this.isDev) {
      this.logger.debug('=== [OAUTH CALLBACK] REQUEST START ===');
      this.logger.debug(
        `[OAUTH CALLBACK] Provider: ${provider}, Code: ${code}`
      );
      this.logger.debug(
        `[OAUTH CALLBACK] Session before: ${JSON.stringify(req.session)}`
      );
    }

    if (!code) {
      this.logger.warn('[OAUTH CALLBACK] No code provided');
      if (this.isDev) {
        this.logger.debug('=== [OAUTH CALLBACK] REQUEST END with Error ===');
      }
      throw new BadRequestException('Code is required');
    }

    try {
      await this.authService.extractProfileFromCode(req, provider, code);

      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) {
            this.logger.error('[OAUTH CALLBACK] Session save error:', err);
            return reject(err);
          }
          if (this.isDev) {
            this.logger.debug('[OAUTH CALLBACK] Session saved successfully');
          }
          resolve();
        });
      });

      const redirectUrl = `${this.configService.getOrThrow<string>('ALLOWED_ORIGIN')}/`;
      if (this.isDev) {
        this.logger.debug(
          `[OAUTH CALLBACK] Session after: ${JSON.stringify(req.session)}`
        );
        this.logger.debug(`[OAUTH CALLBACK] Redirecting to: ${redirectUrl}`);
        this.logger.debug('=== [OAUTH CALLBACK] REQUEST END ===');
      }
      return res.redirect(redirectUrl);
    } catch (error) {
      this.logger.error('[OAUTH CALLBACK] Error:', error);
      if (this.isDev) {
        this.logger.debug('=== [OAUTH CALLBACK] REQUEST END with Error ===');
      }
      throw error;
    }
  }

  @UseGuards(AuthProviderGuard)
  @Get('/oauth/connect/:provider')
  public async connect(@Param('provider') provider: string) {
    if (this.isDev) {
      this.logger.debug('=== [OAUTH CONNECT] REQUEST START ===');
      this.logger.debug(`[OAUTH CONNECT] Provider: ${provider}`);
    }
    const providerInstance = this.providerService.findByService(provider);
    const authUrl = providerInstance.getAuthUrl();
    if (this.isDev) {
      this.logger.debug(`[OAUTH CONNECT] Auth URL: ${authUrl}`);
      this.logger.debug('=== [OAUTH CONNECT] REQUEST END ===');
    }
    return { url: authUrl };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  public async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    if (this.isDev) {
      this.logger.debug('=== [LOGOUT] REQUEST START ===');
      this.logger.debug(
        `[LOGOUT] Session before logout: ${JSON.stringify(req.session)}`
      );
    }
    try {
      const result = await this.authService.logout(req, res);
      if (this.isDev) {
        this.logger.debug(
          `[LOGOUT] Session after logout: ${JSON.stringify(req.session)}`
        );
        this.logger.debug('=== [LOGOUT] REQUEST END ===');
      }
      return result;
    } catch (error) {
      this.logger.error('[LOGOUT] Error:', error);
      if (this.isDev) {
        this.logger.debug('=== [LOGOUT] REQUEST END with Error ===');
      }
      throw error;
    }
  }
}

/*
  - AuthController отвечает за маршруты аутентификации:
    • POST /auth/register — регистрация пользователя, проверка reCAPTCHA, сохранение сессии.
    • POST /auth/login — первый шаг логина (пароль), 2FA-ветка или сразу сохранение сессии, установка cookie authState.
    • POST /auth/login/2fa — подтверждение двухфакторного кода, обновление сессии и cookie.
    • POST /auth/2fa/resend — повторная отправка 2FA-кода.
    • GET /auth/oauth/connect/:provider — получение URL для OAuth-провайдера.
    • GET /auth/oauth/callback/:provider — обработка callback OAuth, связывание/создание аккаунта, сохранение сессии, редирект.
    • POST /auth/logout — уничтожение сессии и очистка cookie.
  - Использует NestJS Logger вместо console.log; debug-логи (`logger.debug`) обёрнуты через флаг isDev, который true если NODE_ENV !== 'production'.
  - В продакшене (NODE_ENV='production') debug-логи не выполняются, но можно при необходимости включить их, поменяв ENV и перезапустив.
*/
