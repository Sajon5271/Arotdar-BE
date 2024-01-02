import {
  IsAlpha,
  IsEmail,
  IsNotEmpty,
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

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(50)
  password: string;
}
