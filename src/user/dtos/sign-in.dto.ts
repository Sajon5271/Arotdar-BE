import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignInDto {
  @IsEmail({}, { message: 'Please provide valid Email' })
  @IsNotEmpty({ message: 'Please provide Email' })
  email: string;

  @IsNotEmpty({ message: 'Please provide password' })
  password: string;
}
