import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @IsEmail({}, { message: 'Please provide valid Email' })
  @IsNotEmpty({ message: 'Please provide Email' })
  @ApiProperty()
  email: string;

  @IsNotEmpty({ message: 'Please provide password' })
  @ApiProperty()
  password: string;
}
