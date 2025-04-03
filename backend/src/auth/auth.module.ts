import { forwardRef, Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "@/user/user.module";
import { GoogleRecaptchaModule } from "@nestlab/google-recaptcha";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { getRecaptchaConfig } from "@/config/recaptcha.config";
import { ProviderModule } from "./provider/provider.module";
import { getProvidersConfig } from "@/config/providers.config";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "@/schemas/user.schema";
import { Account, AccountSchema } from "@/schemas/account.schema";
import { EmailConfirmationModule } from "./email-confirmation/email-confirmation.module";
import { UserService } from "@/user/user.service";
import { MailService } from "@/libs/mail/mail.service";
import { TwoFactorAuthService } from "./two-factor-auth/two-factor-auth.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Account.name, schema: AccountSchema },
    ]),

    ProviderModule.registerAsync({
      imports: [ConfigModule],
      useFactory: getProvidersConfig,
      inject: [ConfigService],
    }),
    UserModule,
    GoogleRecaptchaModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getRecaptchaConfig,
      inject: [ConfigService],
    }),
    forwardRef(() => EmailConfirmationModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, MailService, TwoFactorAuthService],
  exports: [AuthService],
})
export class AuthModule {}
