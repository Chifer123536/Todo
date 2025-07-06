import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hash } from 'argon2';
import { v4 as uuidv4 } from 'uuid';

import { MailService } from '@/libs/mail/mail.service';
import { User, UserDocument } from '@/schemas/user.schema';
import { Token, TokenDocument } from '@/schemas/token.schema';

import { NewPasswordDto } from './dto/new-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class PasswordRecoveryService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Token.name) private readonly tokenModel: Model<TokenDocument>,
    private readonly mailService: MailService
  ) {}

  public async resetPassword(dto: ResetPasswordDto) {
    const existingUser = await this.userModel.findOne({ email: dto.email });

    if (!existingUser) {
      throw new NotFoundException(
        'User not found. Please check the email address and try again.'
      );
    }

    const passwordResetToken = await this.generatePasswordResetToken(
      existingUser.email
    );

    await this.mailService.sendPasswordResetEmail(
      passwordResetToken.email,
      passwordResetToken.token
    );

    return true;
  }

  public async newPassword(dto: NewPasswordDto, token: string) {
    const existingToken = await this.tokenModel.findOne({
      token,
      type: 'PASSWORD_RESET'
    });

    if (!existingToken) {
      throw new NotFoundException('Invalid or expired token.');
    }

    if (existingToken.expiresIn < new Date()) {
      throw new BadRequestException(
        'Token has expired. Please request a new one.'
      );
    }

    const existingUser = await this.userModel.findOne({
      email: existingToken.email
    });

    if (!existingUser) {
      throw new NotFoundException('User not found.');
    }

    existingUser.password = await hash(dto.password);
    await existingUser.save();

    await this.tokenModel.deleteOne({ _id: existingToken._id });

    return true;
  }

  private async generatePasswordResetToken(email: string) {
    const token = uuidv4();
    const expiresIn = new Date(Date.now() + 3600 * 1000);

    await this.tokenModel.deleteOne({ email, type: 'PASSWORD_RESET' });

    const passwordResetToken = await this.tokenModel.create({
      email,
      token,
      expiresIn,
      type: 'PASSWORD_RESET'
    });

    return passwordResetToken;
  }
}
