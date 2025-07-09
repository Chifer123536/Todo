import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import session, { SessionOptions } from 'express-session';
import { RedisStore } from 'connect-redis';

import { AppModule } from './app.module';
import { ms, StringValue } from './libs/common/utils/ms.util';
import { parseBoolean } from './libs/common/utils/parse-boolean.util';
import { redisClient } from './shared/redis/redis.client';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const isProd = config.get<string>('NODE_ENV') === 'production';
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', 1);

  // Сначала CORS, чтобы он не зарезал куки/сессию
  const allowedOrigin = config.get<string>('ALLOWED_ORIGIN');
  app.enableCors({
    origin: (origin, callback) => {
      // разрешаем origin === undefined (при OAuth редиректе)
      if (!origin || origin === allowedOrigin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  });

  app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const sessionConfig: SessionOptions = {
    secret: config.getOrThrow<string>('SESSION_SECRET'),
    name: config.getOrThrow<string>('SESSION_NAME'),
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),
      httpOnly: parseBoolean(config.getOrThrow<string>('SESSION_HTTP_ONLY')),
      secure: isProd,
      domain: config.get<string>('SESSION_DOMAIN'),
      sameSite: (isProd ? 'none' : 'lax') as 'lax' | 'none'
    },
    store: new RedisStore({
      client: redisClient,
      prefix: config.getOrThrow<string>('SESSION_FOLDER')
    })
  };

  app.use(session(sessionConfig));
  app.setGlobalPrefix('api');

  await app.listen(config.getOrThrow<number>('APPLICATION_PORT'));
}

bootstrap();
