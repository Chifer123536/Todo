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

function timestamp(): string {
  return new Date().toISOString().slice(5, 19).replace('T', ' ');
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // ─── Получаем Express-инстанс и ставим trust proxy ─────────────────────────────────────
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', 1);

  // ─── Middleware для проверки protocol/secure ───────────────────────────────────────────────
  app.use((req, res, next) => {
    console.log(
      `${timestamp()} [SECURE CHECK] protocol:`,
      req.protocol,
      'secure:',
      req.secure,
      'host:',
      req.headers.host
    );
    next();
  });

  // ─── Вывод переменных окружения ───────────────────────────────────────────
  console.log(`${timestamp()} ===== STARTUP DEBUG ENV =====`);
  console.log(`${timestamp()} NODE_ENV =`, process.env.NODE_ENV);
  console.log(`${timestamp()} COOKIES_SECRET =`, config.get('COOKIES_SECRET'));
  console.log(`${timestamp()} SESSION_SECRET =`, config.get('SESSION_SECRET'));
  console.log(`${timestamp()} SESSION_NAME =`, config.get('SESSION_NAME'));
  console.log(
    `${timestamp()} SESSION_MAX_AGE =`,
    config.get('SESSION_MAX_AGE')
  );
  console.log(
    `${timestamp()} SESSION_HTTP_ONLY =`,
    config.get('SESSION_HTTP_ONLY')
  );
  console.log(`${timestamp()} SESSION_FOLDER =`, config.get('SESSION_FOLDER'));
  console.log(`${timestamp()} ALLOWED_ORIGIN =`, config.get('ALLOWED_ORIGIN'));
  console.log(`${timestamp()} ==============================`);

  // ─── Cookie secret ─────────────────────────────────────────────────────────
  const cookieSecret = config.getOrThrow<string>('COOKIES_SECRET');
  console.log(`${timestamp()} [DEBUG] cookieSecret:`, cookieSecret);

  // ─── Сбор параметров сессии ────────────────────────────────────────────────
  const sessionSecret = config.getOrThrow<string>('SESSION_SECRET');
  const sessionName = config.getOrThrow<string>('SESSION_NAME');
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

  console.log(`${timestamp()} [DEBUG] Session config values →`, {
    sessionSecret,
    sessionName,
    sessionMaxAge,
    sessionHttpOnly,
    sessionSecure,
    sessionSameSite,
    sessionFolder
  });

  console.log(`${timestamp()} [DEBUG] Types:`);
  console.log(`${timestamp()} sessionSecure type =`, typeof sessionSecure);
  console.log(`${timestamp()} sessionSameSite type =`, typeof sessionSameSite);
  console.log(`${timestamp()} sessionMaxAge type =`, typeof sessionMaxAge);
  console.log(`${timestamp()} sessionHttpOnly type =`, typeof sessionHttpOnly);
  console.log(`${timestamp()} sessionSecret type =`, typeof sessionSecret);

  // ─── Миддлвары ──────────────────────────────────────────────────────────────
  app.use(cookieParser(cookieSecret));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // ─── Логгер запросов и ответов ─────────────────────────────────────────────
  app.use((req, res, next) => {
    const start = Date.now();

    console.log(`${timestamp()} [REQUEST] ${req.method} ${req.originalUrl}`);
    console.log(`${timestamp()} Request headers:`, req.headers);

    if (req.body && Object.keys(req.body).length) {
      console.log(`${timestamp()} Request body:`, req.body);
    }

    console.log(`${timestamp()} Cookies:`, req.cookies);

    res.on('finish', () => {
      const msTime = Date.now() - start;
      console.log(
        `${timestamp()} [RESPONSE] ${req.method} ${req.originalUrl} ${res.statusCode} - ${msTime}ms`
      );
      console.log(`${timestamp()} Response headers:`, res.getHeaders());
    });

    next();
  });

  // ─── Настройка сессии ──────────────────────────────────────────────────────
  const sessionConfig = {
    secret: sessionSecret,
    name: sessionName,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: sessionMaxAge,
      httpOnly: sessionHttpOnly,
      secure: sessionSecure,
      sameSite: sessionSameSite
    },
    store: new RedisStore({ client: redisClient, prefix: sessionFolder })
  };

  console.log(
    `${timestamp()} [DEBUG] Session config to be used →`,
    sessionConfig
  );
  app.use(session(sessionConfig));

  // ─── Разрешаем CORS ────────────────────────────────────────────────────────
  const allowedOrigin = config.get<string>('ALLOWED_ORIGIN');
  console.log(`${timestamp()} [DEBUG] Resolved ALLOWED_ORIGIN:`, allowedOrigin);

  app.enableCors({
    origin: (origin, callback) => {
      console.log(`${timestamp()} [CORS CHECK] Request origin:`, origin);
      if (!origin || origin === allowedOrigin) {
        callback(null, true);
      } else {
        console.warn(
          `${timestamp()} [CORS BLOCKED] Origin not allowed:`,
          origin
        );
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  });

  app.setGlobalPrefix('api');

  // ─── Запуск ────────────────────────────────────────────────────────────────
  await app.listen(config.getOrThrow<number>('APPLICATION_PORT'));
}

bootstrap();
