import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength
} from 'class-validator';

export class UpdateUserDto {
  @IsString({ message: 'Name must be a string.' })
  @IsNotEmpty({ message: 'Name is required.' })
  name: string;

  @IsBoolean({ message: 'isTwoFactorEnabled must be a boolean value.' })
  isTwoFactorEnabled: boolean;

  @IsOptional()
  @IsString({ message: 'Password must be a string.' })
  @MinLength(6, { message: 'Password must be at least 6 characters.' })
  password?: string;
}
