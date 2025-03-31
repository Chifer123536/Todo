import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { TypeBaseProviderOptions } from "./types/base-provider.options.types";
import { TypeUserInfo } from "./types/user-info-types";

@Injectable()
export class BaseOAuthService {
  private BASE_URL: string;

  public constructor(private readonly options: TypeBaseProviderOptions) {}

  protected async extractUserInfo(data: any): Promise<TypeUserInfo> {
    return {
      ...data,
      provider: this.options.name,
    };
  }

  public getAuthUrl() {
    const query = new URLSearchParams({
      response_type: "code",
      client_id: this.options.client_id,
      redirect_uri: this.getRedirectUrl(),
      scope: (this.options.scopes ?? []).join(" "),
      access_type: "offline",
      prompt: "select_account",
    });

    return `${this.options.authorize_url}?${query}`;
  }

  public async findUserByCode(code: string): Promise<TypeUserInfo> {
    const client_id = this.options.client_id;
    const client_secret = this.options.client_secret;

    const tokenQuery = new URLSearchParams({
      client_id,
      client_secret,
      code,
      redirect_uri: this.getRedirectUrl(),
      grant_type: "authorization_code",
    });

    const tokenRequest = await fetch(this.options.access_url, {
      method: "POST",
      body: tokenQuery,
      headers: {
        "Content-type": "application/x-www-form-urlencoded", //Тип содержимого
        Accept: "application/json", //Тип ответа
      },
    });

    if (!tokenRequest.ok) {
      throw new BadRequestException(
        `Failed to retrieve user with {${this.options.profile_url}}. Please check the validity of the access token.`
      );
    }

    const tokens = await tokenRequest.json();

    if (!tokens.access_token) {
      throw new BadRequestException(
        `No tokens from ${this.options.access_url}. Please ensure the authorization code is valid.`
      );
    }

    const userRequest = await fetch(this.options.profile_url, {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!userRequest.ok) {
      throw new UnauthorizedException(
        `Failed to retrieve the user from ${this.options.profile_url}. Please check the access token.`
      );
    }

    const user = await userRequest.json();
    const userData = await this.extractUserInfo(user);

    return {
      ...userData,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: tokens.expires_at || tokens.expires_in,
      provider: this.options.name,
    };
  }

  public getRedirectUrl() {
    return `${this.BASE_URL}/auth/oauth/callback/${this.options.name}`;
  }

  set baseUrl(value: string) {
    this.BASE_URL = value;
  }

  get name() {
    return this.options.name;
  }

  get access_url() {
    return this.options.access_url;
  }

  get profile_url() {
    return this.options.profile_url;
  }

  get scopes() {
    return this.options.scopes;
  }
}

// Базовый сервис для работы с OAuth-авторизацией. Предоставляет общий механизм аутентификации через внешних провайдеров (Google, GitHub и т.д.), который затем можно расширять для конкретных провайдеров.
// Этот сервис: Формирует ссылку для авторизации (getAuthUrl()). Обменивает код на токен и получает пользователя (findUserByCode()). Использует геттеры и сеттеры для удобного управления параметрами. Геттеры позволяют обращаться к свойствам через service.name, service.access_url без скобок. Сеттеры дают возможность изменять baseUrl через service.baseUrl = "..."
