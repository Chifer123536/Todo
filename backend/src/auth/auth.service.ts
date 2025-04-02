import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { UserService } from "@/user/user.service";
import { AuthMethod } from "@/shared/enums";
import { User, UserDocument } from "@/schemas/user.schema";
import { Account, AccountDocument } from "@/schemas/account.schema";

import { Request, Response } from "express";
import { LoginDto } from "./dto/login.dto";
import { verify } from "argon2";
import { ConfigService } from "@nestjs/config";
import { ProviderService } from "./provider/provider.service";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { EmailConfirmationService } from "./email-confirmation/email-confirmation.service";

@Injectable()
export class AuthService {
  public constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Account.name)
    private readonly accountModel: Model<AccountDocument>,
    private readonly userService: UserService,
    private readonly ConfigService: ConfigService,
    private readonly providerService: ProviderService,
    private readonly emailConfirmationService: EmailConfirmationService
  ) {}

  public async register(req: Request, dto: RegisterDto) {
    const isExists = await this.userService.findByEmail(dto.email);

    if (isExists) {
      throw new ConflictException("A user with this email already exists");
    }

    const newUser = await this.userService.create(
      dto.email,
      dto.password,
      dto.name,
      "",
      AuthMethod.CREDENTIALS,
      false
    );

    await this.emailConfirmationService.sendVerificationToken(newUser.email);

    return {
      message: "User registered successfully. Please, confirm your email.",
    };
  }

  public async login(req: Request, dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);

    if (!user || !user.password) {
      throw new NotFoundException("User not found");
    }

    const isValidPassword = await verify(user.password, dto.password);

    if (!isValidPassword) {
      throw new UnauthorizedException("Invalid credentials");
    }

    if (!user.isVerified) {
      await this.emailConfirmationService.sendVerificationToken(user.email);
      throw new UnauthorizedException(
        "User is not verified. Please, confirm your email."
      );
    }

    return this.saveSession(req, user);
  }

  public async extractProfileFromCode(
    req: Request,
    provider: string,
    code: string
  ) {
    const providerInstance = this.providerService.findByService(provider);
    const profile = await providerInstance.findUserByCode(code);
    console.log(profile);

    const account = await this.accountModel.findOne({
      id: profile.id,
      provider: profile.provider,
    });

    let user = account?.userId
      ? await this.userModel.findById(account.userId)
      : null;

    if (user) {
      return this.saveSession(req, user);
    }

    user = await this.userService.create(
      profile.email,
      "",
      profile.name,
      profile.picture,
      AuthMethod[profile.provider.toUpperCase()],
      true
    );

    if (!account) {
      await this.accountModel.create({
        data: {
          userId: user.id,
          type: "oauth",
          provider: profile.provider,
          accessToken: profile.access_token,
          refreshToken: profile.refresh_token,
          expiresAt: profile.expires_at,
        },
      });
    }

    return this.saveSession(req, user);
  }

  public async logout(req: Request, res: Response): Promise<void> {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          return reject(new InternalServerErrorException("Failed to logout"));
        }
        res.clearCookie(this.ConfigService.getOrThrow<string>("SESSION_NAME")),
          resolve();
      });
    });
  }

  public async saveSession(req: Request, user: User) {
    return new Promise((resolve, reject) => {
      req.session.userId = user.id;

      req.session.save((err) => {
        if (err) {
          return reject(
            new InternalServerErrorException("Failed to save session")
          );
        }
        resolve({ user });
      });
    });
  }
}
