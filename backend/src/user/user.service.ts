import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthMethod } from '@/shared/enums';
import { hash } from 'argon2';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from '@/schemas/user.schema';
import { UpdateUserDto } from '@/user/dto/apdate-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) {}

  public async findById(id: string) {
    const user = await this.userModel.findById(id).populate('accounts');

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  public async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email }).populate('accounts');

    return user;
  }

  public async create(
    email: string,
    password: string,
    displayName: string,
    picture: string,
    method: AuthMethod,
    isVerified: boolean
  ) {
    const hashedPassword = password ? await hash(password) : '';

    const user = await this.userModel.create({
      email,
      password: hashedPassword,
      displayName,
      picture,
      method,
      isVerified
    });

    return user;
  }

  public async update(userId: string, dto: UpdateUserDto) {
    const user = await this.findById(userId);

    const updateData: Partial<User> = {
      displayName: dto.name,
      isTwoFactorEnabled: dto.isTwoFactorEnabled
    };

    if (dto.password) {
      updateData.password = await hash(dto.password);
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      user.id,
      updateData,
      { new: true }
    );

    return updatedUser;
  }
}
