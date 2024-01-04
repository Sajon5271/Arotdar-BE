import {
  ArrayNotEmpty,
  IsAlpha,
  IsArray,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PossibleRoles } from '../../constants/default.constants';

export class SignUpDto {
  @IsEmail({}, { message: 'Please provide valid Email' })
  @IsNotEmpty({ message: 'Please provide Email' })
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

  @IsIn(PossibleRoles, { each: true })
  @IsString({ each: true })
  @ArrayNotEmpty({ message: 'No role provided' })
  @IsArray({ message: 'Roles should be an array.' })
  roles: string[] = ['employee'];
}
