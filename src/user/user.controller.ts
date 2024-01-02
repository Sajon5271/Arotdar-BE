import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../schemas/user.schema';
import { CreateUserDto } from './CreateUserDTO';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('all')
  async getAllUser(): Promise<{ data: User[] }> {
    const allUsers = await this.userService.getAll();
    return { data: allUsers };
  }

  @Post('create')
  async createUser(
    @Body() userData: CreateUserDto,
  ): Promise<{ success: boolean; createdUser: User }> {
    console.log(userData);
    const newUser = await this.userService.createUser(
      userData.email,
      userData.name,
      userData.password,
    );
    return { success: true, createdUser: newUser };
  }
}
