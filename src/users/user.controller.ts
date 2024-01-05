import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { User } from '../schemas/user.schema';
import { TransformResponseInterceptor } from '../user/interceptors/transform-response.interceptor';
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
}
