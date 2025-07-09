import { Logger, ValidationPipe } from '@nestjs/common';
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
  const logger = new Logger('Bootstrap');

  const isProd = config.get<string>('NODE_ENV') === 'production';
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', 1);

  // Enable CORS
  const allowedOrigin = config.get<string>('ALLOWED_ORIGIN');
  logger.debug(`Resolved ALLOWED_ORIGIN: ${allowedOrigin}`);
  app.enableCors({
    origin: (origin, callback) => {
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

  logger.debug('===== STARTUP DEBUG ENV =====');
  logger.debug(`NODE_ENV = ${config.get('NODE_ENV')}`);
  logger.debug(`COOKIES_SECRET = ${config.get('COOKIES_SECRET')}`);
  logger.debug(`SESSION_SECRET = ${sessionConfig.secret}`);
  logger.debug(`SESSION_NAME = ${sessionConfig.name}`);
  logger.debug(`SESSION_MAX_AGE = ${sessionConfig.cookie.maxAge}`);
  logger.debug(`SESSION_HTTP_ONLY = ${sessionConfig.cookie.httpOnly}`);
  logger.debug(`SESSION_SECURE = ${sessionConfig.cookie.secure}`);
  logger.debug(`SESSION_COOKIE_SAME_SITE = ${sessionConfig.cookie.sameSite}`);
  logger.debug(`SESSION_FOLDER = ${config.get('SESSION_FOLDER')}`);
  logger.debug('==============================');

  app.use(session(sessionConfig));

  // Middleware: log every request — в любом окружении
  app.use((req, res, next) => {
    logger.debug(`[REQUEST] ${req.method} ${req.originalUrl}`);
    logger.debug(`Cookies: ${JSON.stringify(req.cookies)}`);
    logger.debug(`Session: ${JSON.stringify(req.session, null, 2)}`);
    next();
  });

  app.setGlobalPrefix('api');

  const port = config.getOrThrow<number>('APPLICATION_PORT');
  await app.listen(port);

  logger.log(`Application is running on port ${port}`);
}

bootstrap();
