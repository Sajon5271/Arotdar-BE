import {
  Controller,
  Delete,
  Get,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import {
  TransformResponseInterceptor,
  ValidateOutgoing,
} from '../interceptors/transform-response.interceptor';
import { User } from '../schemas/user.schema';
import { UserService } from './user.service';
import {
  GenericArrayResponse,
  GenericNullResponse,
  GenericObjectResponse,
} from '../swagger/GenericResponseDecorator';
import { PublicUserProperties } from './public-user-properties';
import { ParamDto } from '../shared/dtos/param.dto';
import { Roles } from '../decorators/roles/roles.decorator';
import { CurrentUser } from '../decorators/CurrentUser.decorator';

@ValidateOutgoing(PublicUserProperties)
@Controller('user')
@ApiTags('User management for Super Admin')
@ApiCookieAuth()
@Roles(['superadmin'])
export class UserController {
  constructor(private userService: UserService) {}

  @Get('all')
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
