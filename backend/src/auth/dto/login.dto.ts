import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	MinLength
} from 'class-validator'

export class LoginDto {
	@IsString({ message: 'Email must be a string.' })
	@IsEmail({}, { message: 'Invalid email format.' })
	@IsNotEmpty({ message: 'Email is required.' })
	email: string

	@IsString({ message: 'Password must be a string.' })
	@IsNotEmpty({ message: 'Password cannot be empty.' })
	@MinLength(6, { message: 'Password must be at least 6 characters long.' })
	password: string

	@IsOptional()
	@IsString()
	code: string
}
