import { Controller, Delete, Get, Param } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../decorators/CurrentUser.decorator';
import { Roles } from '../decorators/roles/roles.decorator';
import { ValidateOutgoing } from '../interceptors/transform-response.interceptor';
import { User } from '../schemas/user.schema';
import { ParamDto } from '../shared/dtos/param.dto';
import {
  GenericArrayResponse,
  GenericNullResponse,
  GenericObjectResponse,
} from '../swagger/GenericResponseDecorator';
import { PublicUserProperties } from './public-user-properties';
import { UserService } from './user.service';

@ValidateOutgoing(PublicUserProperties)
@Controller('user')
@ApiTags('User management for Super Admin')
@ApiCookieAuth()
@Roles(['superadmin'])
export class UserController {
  constructor(private userService: UserService) {}

  @Get('all-users')
  @GenericArrayResponse(PublicUserProperties)
  async getAllUser(): Promise<User[]> {
    const allUsers = await this.userService.getAll();
    return allUsers;
  }

  @Get('myinfo')
  @GenericObjectResponse(PublicUserProperties)
  @Roles(['admin', 'employee', 'superadmin'])
  getUserInfo(@CurrentUser() currentUser: PublicUserProperties) {
    return currentUser;
  }

  @Delete('remove/:id')
  @GenericNullResponse()
  removeUser(@Param() param: ParamDto) {
    return this.userService.deleteUser(param.id);
  }
}
