import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { hash } from 'argon2'

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findById(id: string) {
    const user = await this.userModel.findById(id).populate('accounts').exec();
    if (!user) {
      throw new NotFoundException(
        'User was not found',
      );
    }
    return user;
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).populate('accounts').exec();
  }

  async create(
    email: string,
    password: string,
    displayName: string,
    picture: string,
    method: string, 
    isVerified: boolean
  ) {
    const hashedPassword = password ? await hash(password) : '';
    const user = new this.userModel({
      email,
      password: hashedPassword,
      displayName,
      picture,
      method,
      isVerified,
    });
    return user.save();
  }
}
