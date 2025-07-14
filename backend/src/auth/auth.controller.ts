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
  UseGuards
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { TwoFactorDto } from './dto/two-factor.dto';
import { Recaptcha } from '@nestlab/google-recaptcha';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthProviderGuard } from './guards/provider.guard';
import { ProviderService } from './provider/provider.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly providerService: ProviderService
  ) {}

  @Recaptcha()
  @Post('register')
  @HttpCode(HttpStatus.OK)
  public async register(@Req() req: Request, @Body() dto: RegisterDto) {
    const result = await this.authService.register(req, dto);

    await new Promise<void>((resolve, reject) => {
      req.session.save((err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    return result;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(
    @Req() req: Request,
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const result = await this.authService.loginStepOne(req, dto);

    const isProd = this.configService.get<string>('NODE_ENV') === 'production';
    const state =
      req.session.authState === 'pending2FA' ? 'pending2FA' : 'authenticated';

    res.cookie('authState', state, {
      path: '/',
      httpOnly: false,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: state === 'pending2FA' ? 10 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000
    });

    return result;
  }

  @Post('login/2fa')
  @HttpCode(HttpStatus.OK)
  public async login2fa(
    @Req() req: Request,
    @Body() dto: TwoFactorDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const result = await this.authService.confirmTwoFactorCode(req, dto);

    const isProd = this.configService.get<string>('NODE_ENV') === 'production';
    const domain = isProd
      ? this.configService.get<string>('SESSION_DOMAIN')
      : undefined;

    res.cookie('authState', 'authenticated', {
      path: '/',
      httpOnly: false,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      domain,
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    await new Promise<void>((resolve, reject) => {
      req.session.save((err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    return result;
  }

  @Post('2fa/resend')
  @HttpCode(HttpStatus.OK)
  public async resendTwoFactorToken(@Req() req: Request) {
    const result = await this.authService.resendTwoFactorToken(req);

    await new Promise<void>((resolve, reject) => {
      req.session.save((err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    return result;
  }

  @Get('/oauth/callback/:provider')
  @UseGuards(AuthProviderGuard)
  public async callback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Query('code') code: string,
    @Param('provider') provider: string
  ) {
    if (!code) {
      throw new BadRequestException('Code is required');
    }

    await this.authService.extractProfileFromCode(req, provider, code);

    await new Promise<void>((resolve, reject) => {
      req.session.save((err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    const isProd = this.configService.get<string>('NODE_ENV') === 'production';
    const domain = isProd
      ? this.configService.get<string>('SESSION_DOMAIN')
      : undefined;

    res.cookie('authState', 'authenticated', {
      path: '/',
      httpOnly: false,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      domain,
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    const redirectUrl = `${this.configService.getOrThrow<string>(
      'ALLOWED_ORIGIN'
    )}/`;

    return res.redirect(redirectUrl);
  }

  @Get('/oauth/connect/:provider')
  @UseGuards(AuthProviderGuard)
  public async connect(
    @Param('provider') provider: string,
    @Req() req: Request
  ) {
    // Очищаем старую сессию
    await new Promise((resolve, reject) =>
      req.session.regenerate((err) => (err ? reject(err) : resolve(null)))
    );

    const providerInstance = this.providerService.findByService(provider);
    const authUrl = providerInstance.getAuthUrl();

    return { url: authUrl };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  public async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    return this.authService.logout(req, res);
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
*/
