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
    console.log('>>> [AuthController] register() called');
    console.log('>>> [AuthController] Request headers:', req.headers);
    console.log('>>> [AuthController] Register DTO:', dto);

    const result = await this.authService.register(req, dto);

    console.log('<<< [AuthController] register() result:', result);
    return result;
  }

  @Recaptcha()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(@Req() req: Request, @Body() dto: LoginDto) {
    console.log('>>> [AuthController] login() called');
    console.log('>>> [AuthController] Request headers:', req.headers);
    console.log('>>> [AuthController] Login DTO:', dto);

    const result = await this.authService.login(req, dto);

    console.log('<<< [AuthController] login() result:', result);
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
    console.log('>>> [AuthController] oauth callback() called');
    console.log('>>> [AuthController] Provider:', provider);
    console.log('>>> [AuthController] Code:', code);
    console.log(
      '>>> [AuthController] Request session before OAuth:',
      req.session
    );

    if (!code) {
      console.warn('>>> [AuthController] No code provided in OAuth callback');
      throw new BadRequestException('Code is required');
    }

    // Ждём, пока extractProfileFromCode выполнит сохранение сессии
    await this.authService.extractProfileFromCode(req, provider, code);

    // ⬇️ ЯВНО ждём завершения сохранения сессии
    await new Promise<void>((resolve, reject) => {
      req.session.save((err) => {
        if (err) {
          console.error('>>> [AuthController] Session save error:', err);
          return reject(err);
        }
        console.log(
          '>>> [AuthController] Session saved successfully before redirect'
        );
        resolve();
      });
    });

    console.log(
      '<<< [AuthController] OAuth callback completed, redirecting to:',
      this.configService.get<string>('ALLOWED_ORIGIN')
    );

    return res.redirect(
      `${this.configService.getOrThrow<string>('ALLOWED_ORIGIN')}/`
    );
  }

  @UseGuards(AuthProviderGuard)
  @Get('/oauth/connect/:provider')
  public async connect(@Param('provider') provider: string) {
    console.log('>>> [AuthController] oauth connect() called');
    console.log('>>> [AuthController] Provider:', provider);

    const providerInstance = this.providerService.findByService(provider);
    const authUrl = providerInstance.getAuthUrl();

    console.log('<<< [AuthController] OAuth connect URL:', authUrl);
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
    console.log('>>> [AuthController] logout() called');
    console.log(
      '>>> [AuthController] Request session before logout:',
      req.session
    );

    const result = await this.authService.logout(req, res);

    console.log('<<< [AuthController] logout() completed, session destroyed');
    return result;
  }
}
