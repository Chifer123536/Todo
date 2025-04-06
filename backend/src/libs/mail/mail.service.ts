import { MailerService } from "@nestjs-modules/mailer";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { render } from "@react-email/components";

import { ConfirmationTemplate } from "./templates/confirmation.template";
import { ResetPasswordTemplate } from "./templates/reset-password.template";
import { TwoFactorAuthTemplate } from "./templates/two-factor-auth.template";

@Injectable()
export class MailService {
  public constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService
  ) {}

  public async sendConfirmationEmail(email: string, token: string) {
    console.log(`[MailService] Generating confirmation email for: ${email}`);

    const domain = this.configService.getOrThrow<string>("ALLOWED_ORIGIN");
    const html = await render(ConfirmationTemplate({ domain, token }));

    return this.sendMail(email, "Confirm your email", html);
  }

  public async sendPasswordResetEmail(email: string, token: string) {
    console.log(`[MailService] Generating password reset email for: ${email}`);

    const domain = this.configService.getOrThrow<string>("ALLOWED_ORIGIN");
    const html = await render(ResetPasswordTemplate({ domain, token }));

    return this.sendMail(email, "Password reset", html);
  }

  public async sendTwoFactorTokenEmail(email: string, token: string) {
    console.log(`[MailService] Generating two-factor auth email for: ${email}`);

    const html = await render(TwoFactorAuthTemplate({ token }));

    return this.sendMail(email, "Two-factor authentication", html);
  }

  private async sendMail(email: string, subject: string, html: string) {
    try {
      console.log(
        `[MailService] Sending email to: ${email} | Subject: ${subject}`
      );

      const result = await this.mailerService.sendMail({
        to: email,
        subject,
        html,
      });

      console.log(`[MailService] Email successfully sent to: ${email}`, result);
      return result;
    } catch (error) {
      console.error(`[MailService] Failed to send email to ${email}:`, error);
      throw new InternalServerErrorException("Email sending failed");
    }
  }
}
