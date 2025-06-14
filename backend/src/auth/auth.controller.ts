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
    console.log(
      '\n===================== [REGISTER] >>> REQUEST START ====================='
    );
    console.log('[REGISTER] Headers:', req.headers);
    console.log('[REGISTER] Body (DTO):', dto);
    console.log('[REGISTER] Session before:', req.session);

    try {
      const result = await this.authService.register(req, dto);

      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) {
            console.error('!! [REGISTER] Session save error:', err);
            return reject(err);
          }
          console.log('[REGISTER] Session saved successfully');
          resolve();
        });
      });

      console.log('[REGISTER] Session after:', req.session);
      console.log('[REGISTER] Result:', result);
      console.log(
        '===================== [REGISTER] <<< REQUEST END =====================\n'
      );
      return result;
    } catch (error) {
      console.error('!! [REGISTER] Error:', error);
      console.log(
        '===================== [REGISTER] <<< REQUEST END =====================\n'
      );
      throw error;
    }
  }

  @Recaptcha()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(
    @Req() req: Request,
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    console.log(
      '\n===================== [LOGIN] >>> REQUEST START ====================='
    );
    console.log('[LOGIN] Headers:', req.headers);
    console.log('[LOGIN] Body (DTO):', dto);
    console.log('[LOGIN] Session before:', req.session);

    try {
      const result = await this.authService.login(req, dto);

      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) {
            console.error('!! [LOGIN] Session save error:', err);
            return reject(err);
          }
          console.log('[LOGIN] Session saved successfully');
          resolve();
        });
      });

      console.log('[LOGIN] Session after:', req.session);
      console.log('[LOGIN] Result:', result);
      console.log(
        '===================== [LOGIN] <<< REQUEST END =====================\n'
      );
      return result;
    } catch (error) {
      console.error('!! [LOGIN] Error:', error);
      console.log(
        '===================== [LOGIN] <<< REQUEST END =====================\n'
      );
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
    console.log(
      '\n===================== [OAUTH CALLBACK] >>> REQUEST START ====================='
    );
    console.log('[OAUTH CALLBACK] Provider:', provider);
    console.log('[OAUTH CALLBACK] Code:', code);
    console.log('[OAUTH CALLBACK] Session before:', req.session);

    if (!code) {
      console.warn('!! [OAUTH CALLBACK] No code provided in OAuth callback');
      console.log(
        '===================== [OAUTH CALLBACK] <<< REQUEST END =====================\n'
      );
      throw new BadRequestException('Code is required');
    }

    try {
      await this.authService.extractProfileFromCode(req, provider, code);

      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) {
            console.error('!! [OAUTH CALLBACK] Session save error:', err);
            return reject(err);
          }
          console.log(
            '[OAUTH CALLBACK] Session saved successfully before redirect'
          );
          resolve();
        });
      });

      console.log('[OAUTH CALLBACK] Session after:', req.session);
      console.log(
        '===================== [OAUTH CALLBACK] <<< REQUEST END =====================\n'
      );

      const redirectUrl = `${this.configService.getOrThrow<string>('ALLOWED_ORIGIN')}/`;
      console.log('[OAUTH CALLBACK] Redirecting to:', redirectUrl);
      return res.redirect(redirectUrl);
    } catch (error) {
      console.error('!! [OAUTH CALLBACK] Error:', error);
      console.log(
        '===================== [OAUTH CALLBACK] <<< REQUEST END =====================\n'
      );
      throw error;
    }
  }

  @UseGuards(AuthProviderGuard)
  @Get('/oauth/connect/:provider')
  public async connect(@Param('provider') provider: string) {
    console.log(
      '\n===================== [OAUTH CONNECT] >>> REQUEST START ====================='
    );
    console.log('[OAUTH CONNECT] Provider:', provider);

    const providerInstance = this.providerService.findByService(provider);
    const authUrl = providerInstance.getAuthUrl();

    console.log('[OAUTH CONNECT] Auth URL:', authUrl);
    console.log(
      '===================== [OAUTH CONNECT] <<< REQUEST END =====================\n'
    );

    return { url: authUrl };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  public async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    console.log(
      '\n===================== [LOGOUT] >>> REQUEST START ====================='
    );
    console.log('[LOGOUT] Session before logout:', req.session);

    try {
      const result = await this.authService.logout(req, res);

      console.log(
        '[LOGOUT] Session after logout (should be destroyed):',
        req.session
      );
      console.log(
        '===================== [LOGOUT] <<< REQUEST END =====================\n'
      );
      return result;
    } catch (error) {
      console.error('!! [LOGOUT] Error:', error);
      console.log(
        '===================== [LOGOUT] <<< REQUEST END =====================\n'
      );
      throw error;
    }
  }
}
