import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Token, TokenDocument } from '@/schemas/token.schema';
import { MailService } from '@/libs/mail/mail.service';
import { TokenType } from '../../shared/enums';

@Injectable()
export class TwoFactorAuthService {
  constructor(
    @InjectModel(Token.name) private readonly tokenModel: Model<TokenDocument>,
    private readonly mailService: MailService
  ) {}

  public async validateTwoFactorToken(email: string, code: string) {
    const existingToken = await this.tokenModel.findOne({
      email,
      type: TokenType.TWO_FACTOR
    });

    if (!existingToken) {
      throw new NotFoundException(
        'Two-factor authentication token not found. Please ensure that you requested the token for this email address.'
      );
    }

    if (existingToken.token !== code) {
      throw new BadRequestException(
        'Invalid two-factor authentication code. Please check the code you entered and try again.'
      );
    }

    if (new Date(existingToken.expiresIn) < new Date()) {
      throw new BadRequestException(
        'Your two-factor authentication token has expired. Please request a new token.'
      );
    }

    await this.tokenModel.deleteOne({ _id: existingToken._id });

    return true;
  }

  public async sendTwoFactorToken(email: string) {
    const twoFactorToken = await this.generateTwoFactorToken(email);

    await this.mailService.sendTwoFactorTokenEmail(
      twoFactorToken.email,
      twoFactorToken.token
    );

    return true;
  }

  private async generateTwoFactorToken(email: string) {
    const token = Math.floor(
      Math.random() * (1000000 - 100000) + 100000
    ).toString();
    const expiresIn = new Date(new Date().getTime() + 300000);

    await this.tokenModel.deleteOne({ email, type: TokenType.TWO_FACTOR });

    const twoFactorToken = await this.tokenModel.create({
      email,
      token,
      expiresIn,
      type: TokenType.TWO_FACTOR
    });

    return twoFactorToken;
  }
}
