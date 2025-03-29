import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { IS_DEV_ENV } from "./libs/common/utils/is-dev.util";
import { DatabaseModule } from "./shared/database/database.module";
import { TodosModule } from "./todos/todos.module";
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

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
  ],
})
export class AppModule {} 
