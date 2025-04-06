import { Module } from "@nestjs/common";
import { TwoFactorAuthService } from "./two-factor-auth.service";
import { MailService } from "@/libs/mail/mail.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Token, TokenSchema } from "@/schemas/token.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
  ],
  providers: [TwoFactorAuthService, MailService],
})
export class TwoFactorAuthModule {}
