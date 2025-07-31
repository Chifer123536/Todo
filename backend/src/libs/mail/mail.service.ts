import {
  Injectable,
  InternalServerErrorException,
  Logger
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { render } from '@react-email/components';

import { ConfirmationTemplate } from './templates/confirmation.template';
import { ResetPasswordTemplate } from './templates/reset-password.template';
import { TwoFactorAuthTemplate } from './templates/two-factor-auth.template';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly resend: Resend;
  private readonly sender: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.getOrThrow<string>('RESEND_API_KEY');
    this.sender = this.configService.getOrThrow<string>('RESEND_SENDER_EMAIL');
    this.resend = new Resend(apiKey);
  }

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
    this.logger.debug(`Subject: ${subject}`);
    this.logger.debug(`HTML size: ${html.length} chars`);

    try {
      const result = await this.resend.emails.send({
        from: this.sender,
        to: email,
        subject,
        html
      });

      return result;
    } catch (error) {
      this.logger.error(
        `❌ Failed to send email to ${email}: ${error.message}`,
        error.stack
      );
      throw new InternalServerErrorException('Email sending failed');
    }
  }
}
