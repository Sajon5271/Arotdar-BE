import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import {
  ANONYMOUS_ROUTE,
  ROLES_DATA,
} from '../../constants/decorators.constants';
import {
  CurrentUserKey,
  JWTtokenNameInCookie,
} from '../../constants/default.constants';
import { RoleType } from '../../decorators/roles/roles.decorator';
import { UserService } from '../../users/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const anonymouseRoute = this.reflector.getAllAndOverride(ANONYMOUS_ROUTE, [
      context.getClass(),
      context.getHandler(),
    ]);
    if (anonymouseRoute) return true;
    const requiredRoles: RoleType[] = this.reflector.getAllAndOverride(
      ROLES_DATA,
      [context.getHandler(), context.getClass()],
    );
    const currentRequestObj = context.switchToHttp().getRequest();
    const session = currentRequestObj.session;
    if (!session || !session[JWTtokenNameInCookie]) {
      throw new ForbiddenException('No token provided');
    }
    let jwtPayload: Record<string, any> = undefined;
    try {
      jwtPayload = await this.jwtService.verifyAsync(
        session[JWTtokenNameInCookie],
        { secret: process.env.JWT_SECRET },
      );
    } catch (err) {
      throw new BadRequestException('Malformed token');
    }
    if (!jwtPayload) throw new BadRequestException('Malformed token');

    if (!requiredRoles?.some((el) => jwtPayload.roles.includes(el))) {
      throw new UnauthorizedException('You are not authorized');
    }
    const currentUser = await this.userService.getLoggedInUser(jwtPayload.sub);
    currentRequestObj[CurrentUserKey] = currentUser;
    return true;
  }
}
