import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";
import session from "express-session";
import { RedisStore } from "connect-redis";

import { AppModule } from "./app.module";
import { ms, StringValue } from "./libs/common/utils/ms.util";
import { parseBoolean } from "./libs/common/utils/parse-boolean.util";
import { redisClient } from "./shared/redis/redis.client";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.use(cookieParser(config.getOrThrow<string>("COOKIES_SECRET")));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );

  app.use(
    session({
      secret: config.getOrThrow<string>("SESSION_SECRET"),
      name: config.getOrThrow<string>("SESSION_NAME"),
      resave: true,
      saveUninitialized: false,
      cookie: {
        domain: config.getOrThrow<string>("SESSION_DOMAIN"),
        maxAge: ms(config.getOrThrow<StringValue>("SESSION_MAX_AGE")),
        httpOnly: parseBoolean(config.getOrThrow<string>("SESSION_HTTP_ONLY")),
        secure: parseBoolean(config.getOrThrow<string>("SESSION_SECURE")),
        sameSite: "lax",
      },
      store: new RedisStore({
        client: redisClient,
        prefix: config.getOrThrow<string>("SESSION_FOLDER"),
      }),
    })
  );

  app.enableCors({
    origin: config.getOrThrow<string>("ALLOWED_ORIGIN"),
    credentials: true,
    exposedHeaders: ["set-cookie"],
  });

  await app.listen(config.getOrThrow<number>("APPLICATION_PORT"));
}
bootstrap();
