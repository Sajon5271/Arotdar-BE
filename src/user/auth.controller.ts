import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Session,
  UseInterceptors,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWTtokenNameInCookie } from '../constants/default.constants';
import { AnonymousRoute } from '../decorators/anonymous-route/anonymous-route.decorator';
import { User } from '../schemas/user.schema';
import { SignInDto } from './dtos/sign-in.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { TransformResponseInterceptor } from './interceptors/transform-response.interceptor';
import { UserService } from '../users/user.service';
import { Roles } from '../decorators/roles/roles.decorator';
import { CurrentUser } from './decorators/CurrentUser.decorator';
import { PublicUserProperties } from '../users/public-user-properties';

@Controller('auth')
@AnonymousRoute()
export class AuthController {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  @UseInterceptors(TransformResponseInterceptor)
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
  async signIn(
    @Body() loginData: SignInDto,
    @Session() cookie: Record<string, any>,
  ): Promise<null> {
    const newUser = await this.userService.checkCredintials(
      loginData.email,
      loginData.password,
    );
    // !Bad practice to do this in controller, but for now continuing like this
    const jwtToken = await this.jwtService.signAsync({
      sub: newUser._id,
      roles: newUser.roles,
    });

    cookie[JWTtokenNameInCookie] = jwtToken;
    return null;
  }

  @HttpCode(HttpStatus.OK)
  @Post('signout')
  signOut(@Session() cookie: Record<string, any>) {
    cookie[JWTtokenNameInCookie] = null;
    return null;
  }
}
