import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { User } from '../schemas/user.schema';
import { SignUpDto } from './dtos/sign-up.dto';
import { TransformResponseInterceptor } from './interceptors/transform-response.interceptor';
import { UserService } from './user.service';
import { SignInDto } from './dtos/sign-in.dto';

@UseInterceptors(TransformResponseInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private userService: UserService) {}

  @Post('signup')
  async signUp(@Body() userData: SignUpDto): Promise<User> {
    const newUser = await this.userService.createUser(
      userData.email,
      userData.name,
      userData.password,
      userData.roles,
    );
    return newUser;
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(@Body() loginData: SignInDto): Promise<User> {
    const newUser = await this.userService.checkCredintials(
      loginData.email,
      loginData.password,
    );
    return newUser;
  }
}
