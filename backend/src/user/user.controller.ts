import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthoRized } from '@/auth/decorators/authorized.decorator';
import { Authorization } from '@/auth/decorators/auth.decorator';
import { UserRole } from '@/shared/enums';
import { UpdateUserDto } from './dto/apdate-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Authorization()
  @HttpCode(HttpStatus.OK)
  @Get('profile')
  public async findFrofile(@AuthoRized('id') userId: string) {
    return this.userService.findById(userId);
  }

  @Authorization(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Get('by-id/:id')
  public async findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Authorization()
  @HttpCode(HttpStatus.OK)
  @Patch('profile')
  public async updateProfile(
    @AuthoRized('id') userId: string,
    @Body() dto: UpdateUserDto
  ) {
    return this.userService.update(userId, dto);
  }
}
