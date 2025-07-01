import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { render } from '@react-email/components';

import { ConfirmationTemplate } from './templates/confirmation.template';
import { ResetPasswordTemplate } from './templates/reset-password.template';
import { TwoFactorAuthTemplate } from './templates/two-factor-auth.template';

@Injectable()
export class MailService {
  public constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService
  ) {}

  public async sendConfirmationEmail(email: string, token: string) {
    const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN');
    const html = await render(ConfirmationTemplate({ domain, token }));

    return this.sendMail(email, 'Confirm your email', html);
  }

  public async sendPasswordResetEmail(email: string, token: string) {
    const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN');
    const html = await render(ResetPasswordTemplate({ domain, token }));

    return this.sendMail(email, 'Password reset', html);
  }

  public async sendTwoFactorTokenEmail(email: string, token: string) {
    const html = await render(TwoFactorAuthTemplate({ token }));

    return this.sendMail(email, 'Two-factor authentication', html);
  }

  private async sendMail(email: string, subject: string, html: string) {
    try {
      return await this.mailerService.sendMail({
        to: email,
        subject,
        html
      });
    } catch {
      throw new InternalServerErrorException('Email sending failed');
    }
  }
}
