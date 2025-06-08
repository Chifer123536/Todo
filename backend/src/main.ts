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

  // ─── Cookie Secret ───────────────────────────────────────────────────────
  const cookieSecret = config.getOrThrow<string>('COOKIES_SECRET');
  console.log('[DEBUG] cookieSecret:', cookieSecret);

  // ─── Парсим и логируем все значения ──────────────────────────────────────
  const sessionSecret = config.getOrThrow<string>('SESSION_SECRET');
  const sessionName = config.getOrThrow<string>('SESSION_NAME');
  const sessionDomain = config.getOrThrow<string>('SESSION_DOMAIN');
  const sessionMaxAge = ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE'));
  const sessionHttpOnly = parseBoolean(
    config.getOrThrow<string>('SESSION_HTTP_ONLY')
  );
  const sessionSecure = parseBoolean(
    config.getOrThrow<string>('SESSION_SECURE')
  );
  const sessionSameSite = config.getOrThrow<string>(
    'SESSION_COOKIE_SAME_SITE'
  ) as 'lax' | 'strict' | 'none';
  const sessionFolder = config.getOrThrow<string>('SESSION_FOLDER');

  console.log('[DEBUG] Session config values →', {
    sessionSecret,
    sessionName,
    sessionDomain,
    sessionMaxAge,
    sessionHttpOnly,
    sessionSecure,
    sessionSameSite,
    sessionFolder
  });

  // ─── Печатаем типы для отладки ───────────────────────────────────────────
  console.log('[DEBUG] Types:');
  console.log('sessionSecure type =', typeof sessionSecure);
  console.log('sessionSameSite type =', typeof sessionSameSite);
  console.log('sessionMaxAge type =', typeof sessionMaxAge);
  console.log('sessionHttpOnly type =', typeof sessionHttpOnly);
  console.log('sessionSecret type =', typeof sessionSecret);

  // ─── cookieParser ───────────────────────────────────────────────────────────
  app.use(cookieParser(cookieSecret));

  // ─── Валидация DTO ──────────────────────────────────────────────────────────
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // ─── Глобальный логер запросов и ответов ───────────────────────────────────
  app.use((req, res, next) => {
    const start = Date.now();
    console.log(
      `[REQUEST] ${req.method} ${req.originalUrl} - cookies:`,
      req.cookies
    );

    res.on('finish', () => {
      const ms = Date.now() - start;
      console.log(
        `[RESPONSE] ${req.method} ${req.originalUrl} ${res.statusCode} - ${ms}ms`
      );
    });

    next();
  });

  // ─── Session + RedisStore ───────────────────────────────────────────────────
  const sessionConfig = {
    secret: sessionSecret,
    name: sessionName,
    resave: true,
    saveUninitialized: false,
    cookie: {
      domain: sessionDomain,
      maxAge: sessionMaxAge,
      httpOnly: sessionHttpOnly,
      secure: sessionSecure,
      sameSite: sessionSameSite
    },
    store: new RedisStore({ client: redisClient, prefix: sessionFolder })
  };

  console.log('[DEBUG] Session config to be used →', sessionConfig);
  app.use(session(sessionConfig));

  // ─── CORS ──────────────────────────────────────────────────────────────────
  app.enableCors({
    origin: config.getOrThrow<string>('ALLOWED_ORIGIN'),
    credentials: true
  });

  await app.listen(config.getOrThrow<number>('APPLICATION_PORT'));
}

bootstrap();
