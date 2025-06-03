import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { RedisStore } from 'connect-redis';

import { AppModule } from './app.module';
import { ms, StringValue } from './libs/common/utils/ms.util';
import { parseBoolean } from './libs/common/utils/parse-boolean.util';
import { redisClient } from './shared/redis/redis.client';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // ─── Debug: покажем, что именно прочиталось из ENV ─────────────────────────
  console.log('===== STARTUP DEBUG ENV =====');
  console.log('NODE_ENV =', process.env.NODE_ENV);
  console.log('COOKIES_SECRET =', config.get('COOKIES_SECRET'));
  console.log('SESSION_SECRET =', config.get('SESSION_SECRET'));
  console.log('SESSION_NAME =', config.get('SESSION_NAME'));
  console.log('SESSION_DOMAIN =', config.get('SESSION_DOMAIN'));
  console.log('SESSION_MAX_AGE =', config.get('SESSION_MAX_AGE'));
  console.log('SESSION_HTTP_ONLY =', config.get('SESSION_HTTP_ONLY'));
  console.log('SESSION_SECURE =', config.get('SESSION_SECURE'));
  console.log(
    'SESSION_COOKIE_SAME_SITE =',
    config.get('SESSION_COOKIE_SAME_SITE')
  );
  console.log('SESSION_FOLDER =', config.get('SESSION_FOLDER'));
  console.log('ALLOWED_ORIGIN =', config.get('ALLOWED_ORIGIN'));
  console.log('==============================');

  // ─── cookieParser ───────────────────────────────────────────────────────────
  app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')));

  // ─── Валидация DTO ──────────────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true
    })
  );

  // ─── Session + RedisStore ───────────────────────────────────────────────────
  const secret = config.getOrThrow<string>('SESSION_SECRET');
  const name = config.getOrThrow<string>('SESSION_NAME');
  const domain = config.getOrThrow<string>('SESSION_DOMAIN');
  const maxAge = ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE'));
  const httpOnly = parseBoolean(config.getOrThrow<string>('SESSION_HTTP_ONLY'));
  const secure = parseBoolean(config.getOrThrow<string>('SESSION_SECURE'));
  const sameSite = config.getOrThrow<string>('SESSION_COOKIE_SAME_SITE') as
    | 'lax'
    | 'strict'
    | 'none';
  const prefix = config.getOrThrow<string>('SESSION_FOLDER');

  console.log('[DEBUG] Session config →', {
    secret,
    name,
    domain,
    maxAge,
    httpOnly,
    secure,
    sameSite,
    prefix
  });

  app.use(
    session({
      secret,
      name,
      resave: true, // можно false, если не надо пересохранять пустую сессию
      saveUninitialized: false, // не сохранять пустые сессии
      cookie: {
        domain,
        maxAge,
        httpOnly,
        secure,
        sameSite
      },
      store: new RedisStore({
        client: redisClient,
        prefix
      })
    })
  );

  // ─── CORS ──────────────────────────────────────────────────────────────────
  app.enableCors({
    origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
    credentials: true
  });

  await app.listen(config.getOrThrow<number>('APPLICATION_PORT'));
}

bootstrap();
