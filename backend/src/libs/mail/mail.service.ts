import { MailerService } from '@nestjs-modules/mailer';
import {
  Injectable,
  InternalServerErrorException,
  Logger
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { render } from '@react-email/components';

import { ConfirmationTemplate } from './templates/confirmation.template';
import { ResetPasswordTemplate } from './templates/reset-password.template';
import { TwoFactorAuthTemplate } from './templates/two-factor-auth.template';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name); // 👈 Привязываем логгер к классу

  constructor(
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
    this.logger.log(`📨 Sending email to ${email}`);
    this.logger.debug(`Subject: ${subject}`);
    this.logger.debug(`HTML size: ${html.length} chars`);

    try {
      const result = await this.mailerService.sendMail({
        to: email,
        subject,
        html
      });

      this.logger.log(`✅ Email sent successfully to ${email}`);
      this.logger.verbose(`Mailer result: ${JSON.stringify(result)}`);
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
