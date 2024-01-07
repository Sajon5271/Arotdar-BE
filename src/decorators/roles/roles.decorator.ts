import { SetMetadata } from '@nestjs/common';
import { ROLES_DATA } from '../../constants/decorators.constants';

export type RoleType = 'superadmin' | 'admin' | 'employee';

export const Roles = (args: RoleType[]) => SetMetadata(ROLES_DATA, args);
