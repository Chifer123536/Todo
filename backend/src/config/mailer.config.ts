import { MailerOptions } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

export const getMailerConfig = async (
  configService: ConfigService
): Promise<MailerOptions> => ({
  transport: {
    host: configService.getOrThrow<string>('MAIL_HOST'),
    port: configService.getOrThrow<number>('MAIL_PORT'),
    secure: configService.getOrThrow<number>('MAIL_PORT') === 465,
    name: configService.getOrThrow<string>('APPLICATION_URL'),
    auth: {
      user: configService.getOrThrow<string>('MAIL_LOGIN'),
      pass: configService.getOrThrow<string>('MAIL_PASSWORD')
    }
  },
  defaults: {
    from: `TodoList ${configService.getOrThrow<string>('MAIL_LOGIN')}`
  }
});
