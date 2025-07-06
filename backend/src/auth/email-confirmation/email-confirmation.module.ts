import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { EmailConfirmationService } from './email-confirmation.service';
import { EmailConfirmationController } from './email-confirmation.controller';

import { Token, TokenSchema } from '@/schemas/token.schema';
import { User, UserSchema } from '@/schemas/user.schema';

import { MailModule } from '@/libs/mail/mail.module';
import { AuthModule } from '../auth.module';
import { UserService } from '@/user/user.service';
import { MailService } from '@/libs/mail/mail.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Token.name, schema: TokenSchema },
      { name: User.name, schema: UserSchema }
    ]),
    MailModule,
    forwardRef(() => AuthModule)
  ],
  controllers: [EmailConfirmationController],
  providers: [EmailConfirmationService, UserService, MailService],
  exports: [EmailConfirmationService]
})
export class EmailConfirmationModule {}
