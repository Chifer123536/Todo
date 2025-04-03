import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { IS_DEV_ENV } from "./libs/common/utils/is-dev.util";
import { DatabaseModule } from "./shared/database/database.module";
import { TodosModule } from "./todos/todos.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { ProviderModule } from "./auth/provider/provider.module";
import { MailModule } from "./libs/mail/mail.module";
import { EmailConfirmationModule } from "./auth/email-confirmation/email-confirmation.module";
import { PasswordRecoveryModule } from "./password-recovery/password-recovery.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: !IS_DEV_ENV,
      isGlobal: true,
    }),
    DatabaseModule,
    TodosModule,
    AuthModule,
    UserModule,
    ProviderModule,
    MailModule,
    EmailConfirmationModule,
    PasswordRecoveryModule,
  ],
})
export class AppModule {}
