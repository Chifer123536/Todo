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
import { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { Recaptcha } from '@nestlab/google-recaptcha';
import { AuthProviderGuard } from './guards/provider.guard';
import { ConfigService } from '@nestjs/config';
import { ProviderService } from './provider/provider.service';

@Controller('auth')
export class AuthController {
  public constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly providerService: ProviderService
  ) {
    console.log('>>> [AuthController] Initialized');
    console.log(
      '>>> [AuthController] ALLOWED_ORIGIN =',
      this.configService.get<string>('ALLOWED_ORIGIN')
    );
  }

  @Recaptcha()
  @Post('register')
  @HttpCode(HttpStatus.OK)
  public async register(@Req() req: Request, @Body() dto: RegisterDto) {
    console.log('>>> [AuthController] [REGISTER] register() called');
    console.log(
      '>>> [AuthController] [REGISTER] Request headers:',
      req.headers
    );
    console.log('>>> [AuthController] [REGISTER] Register DTO:', dto);

    const result = await this.authService.register(req, dto);

    console.log('<<< [AuthController] [REGISTER] register() result:', result);
    return result;
  }

  @Recaptcha()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(@Req() req: Request, @Body() dto: LoginDto) {
    console.log('>>> [AuthController] [LOGIN] login() called');
    console.log('>>> [AuthController] [LOGIN] Request headers:', req.headers);
    console.log('>>> [AuthController] [LOGIN] Login DTO:', dto);

    const result = await this.authService.login(req, dto);

    console.log('<<< [AuthController] [LOGIN] login() result:', result);
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
    console.log(
      '>>> [AuthController] [OAUTH CALLBACK] oauth callback() called'
    );
    console.log('>>> [AuthController] [OAUTH CALLBACK] Provider:', provider);
    console.log('>>> [AuthController] [OAUTH CALLBACK] Code:', code);
    console.log(
      '>>> [AuthController] [OAUTH CALLBACK] Request session before OAuth:',
      req.session
    );

    if (!code) {
      console.warn(
        '>>> [AuthController] [OAUTH CALLBACK] No code provided in OAuth callback'
      );
      throw new BadRequestException('Code is required');
    }

    // Ждём, пока extractProfileFromCode выполнит сохранение сессии
    await this.authService.extractProfileFromCode(req, provider, code);

    // ⬇️ ЯВНО ждём завершения сохранения сессии
    await new Promise<void>((resolve, reject) => {
      req.session.save((err) => {
        if (err) {
          console.error(
            '>>> [AuthController] [OAUTH CALLBACK] Session save error:',
            err
          );
          return reject(err);
        }
        console.log(
          '>>> [AuthController] [OAUTH CALLBACK] Session saved successfully before redirect'
        );
        resolve();
      });
    });

    console.log(
      '<<< [AuthController] [OAUTH CALLBACK] OAuth callback completed, redirecting to:',
      this.configService.get<string>('ALLOWED_ORIGIN')
    );

    return res.redirect(
      `${this.configService.getOrThrow<string>('ALLOWED_ORIGIN')}/`
    );
  }

  @UseGuards(AuthProviderGuard)
  @Get('/oauth/connect/:provider')
  public async connect(@Param('provider') provider: string) {
    console.log('>>> [AuthController] [OAUTH CONNECT] oauth connect() called');
    console.log('>>> [AuthController] [OAUTH CONNECT] Provider:', provider);

    const providerInstance = this.providerService.findByService(provider);
    const authUrl = providerInstance.getAuthUrl();

    console.log(
      '<<< [AuthController] [OAUTH CONNECT] OAuth connect URL:',
      authUrl
    );
    return {
      url: authUrl
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  public async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    console.log('>>> [AuthController] [LOGOUT] logout() called');
    console.log(
      '>>> [AuthController] [LOGOUT] Request session before logout:',
      req.session
    );

    const result = await this.authService.logout(req, res);

    console.log(
      '<<< [AuthController] [LOGOUT] logout() completed, session destroyed'
    );
    return result;
  }
}
