import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { User } from '../schemas/user.schema';
import { TransformResponseInterceptor } from '../interceptors/transform-response.interceptor';
import { UserService } from './user.service';
import { ApiExcludeController } from '@nestjs/swagger';

@UseInterceptors(TransformResponseInterceptor)
@Controller('user')
@ApiExcludeController()
export class UserController {
  constructor(private userService: UserService) {}

  @Get('all')
  async getAllUser(): Promise<User[]> {
    const allUsers = await this.userService.getAll();
    return allUsers;
  }
}
