import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';

import { Token, TokenDocument } from '@/schemas/token.schema';
import { User, UserDocument } from '@/schemas/user.schema';
import { TokenType } from '../../shared/enums';

import { MailService } from '@/libs/mail/mail.service';
import { UserService } from '@/user/user.service';
import { AuthService } from '../auth.service';

import { ConfirmationDto } from './dto/confirmation.dto';

@Injectable()
export class EmailConfirmationService {
  constructor(
    @InjectModel(Token.name) private readonly tokenModel: Model<TokenDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly mailService: MailService,
    private readonly userService: UserService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService
  ) {}

  public async newVerification(req: Request, dto: ConfirmationDto) {
    const existingToken = await this.tokenModel.findOne({
      token: dto.token,
      type: TokenType.VERIFICATION
    });

    if (!existingToken) {
      throw new NotFoundException(
        'Verification token not found. Please ensure you have entered the correct token.'
      );
    }

    if (new Date(existingToken.expiresIn) < new Date()) {
      throw new BadRequestException(
        'Verification token has expired. Please request a new verification token.'
      );
    }

    const existingUser = await this.userModel.findOne({
      email: existingToken.email
    });

    if (!existingUser) {
      throw new NotFoundException(
        'User not found. Please check the entered email address and try again.'
      );
    }

    await this.userModel.updateOne(
      { _id: existingUser._id },
      { $set: { isVerified: true } }
    );

    await this.tokenModel.deleteOne({
      _id: existingToken._id,
      type: TokenType.VERIFICATION
    });

    return this.authService.saveSession(req, existingUser);
  }

  public async sendVerificationToken(email: string) {
    const verificationToken = await this.generateVerificationToken(email);

    await this.mailService.sendConfirmationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return verificationToken;
  }

  private async generateVerificationToken(email: string) {
    const token = uuidv4();
    const expiresIn = new Date(new Date().getTime() + 3600 * 1000);

    await this.tokenModel.deleteOne({ email, type: TokenType.VERIFICATION });

    const verificationToken = await this.tokenModel.create({
      email,
      token,
      expiresIn,
      type: TokenType.VERIFICATION
    });

    return verificationToken;
  }
}
