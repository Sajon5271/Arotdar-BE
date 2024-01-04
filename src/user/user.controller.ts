import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { User } from '../schemas/user.schema';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { TransformResponseInterceptor } from './interceptors/transform-response.interceptor';
import { UserService } from './user.service';

@UseInterceptors(TransformResponseInterceptor)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('all')
  async getAllUser(): Promise<User[]> {
    const allUsers = await this.userService.getAll();
    return allUsers;
  }

  @HttpCode(200)
  @Post('create')
  async createUser(@Body() userData: CreateUserDto): Promise<User> {
    const newUser = await this.userService.createUser(
      userData.email,
      userData.name,
      userData.password,
    );
    return newUser;
  }
}
