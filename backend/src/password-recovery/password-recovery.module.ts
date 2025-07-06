import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PasswordRecoveryService } from './password-recovery.service';
import { PasswordRecoveryController } from './password-recovery.controller';
import { MailService } from '@/libs/mail/mail.service';

import { User, UserSchema } from '@/schemas/user.schema';
import { Token, TokenSchema } from '@/schemas/token.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Token.name, schema: TokenSchema }
    ])
  ],
  controllers: [PasswordRecoveryController],
  providers: [PasswordRecoveryService, MailService]
})
export class PasswordRecoveryModule {}
