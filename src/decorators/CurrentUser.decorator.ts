import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { CurrentUserKey } from '../constants/default.constants';

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    return context.switchToHttp().getRequest()[CurrentUserKey];
  },
);
