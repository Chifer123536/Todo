import { ConfigService } from '@nestjs/config';

import { TypeOptions } from '@/auth/provider/provider.constants';
import { GoogleProvider } from '@/auth/provider/services/google.provider';
import { YandexProvider } from '@/auth/provider/services/yandex.provider';

export const getProvidersConfig = async (
  configService: ConfigService
): Promise<TypeOptions> => ({
  baseUrl: configService.getOrThrow<string>('APPLICATION_URL'),
  services: [
    new GoogleProvider({
      client_id: configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      client_secret: configService.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      scopes: ['email', 'profile']
    }),
    new YandexProvider({
      client_id: configService.getOrThrow<string>('YANDEX_CLIENT_ID'),
      client_secret: configService.getOrThrow<string>('YANDEX_CLIENT_SECRET'),
      scopes: ['login:email', 'login:avatar', 'login:info']
    })
  ]
});
