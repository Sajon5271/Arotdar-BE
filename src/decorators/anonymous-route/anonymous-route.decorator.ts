import { SetMetadata } from '@nestjs/common';
import { ANONYMOUS_ROUTE } from '../../constants/decorators.constants';

export const AnonymousRoute = () => SetMetadata(ANONYMOUS_ROUTE, true);
