import {
  IsAlpha,
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsAlpha()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @MaxLength(50)
  // @MinLength(8, { message: 'Password too short' })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minSymbols: 0,
      minNumbers: 1,
    },
    { message: 'Weak password' },
  )
  @IsNotEmpty({ message: 'Please provide password' })
  password: string;
}
