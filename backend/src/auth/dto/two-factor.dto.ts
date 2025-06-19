import { IsNotEmpty, IsString, Length } from 'class-validator';

export class TwoFactorDto {
  @IsString({ message: 'Code must be a string.' })
  @IsNotEmpty({ message: 'Two-factor code is required.' })
  @Length(6, 6, { message: 'Code must be exactly 6 digits.' })
  code: string;
}
