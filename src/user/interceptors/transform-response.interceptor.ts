import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Observable, map } from 'rxjs';
import { UserResponseDTO } from '../dtos/UserResponse.dto';

export class TransformResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return plainToClass(UserResponseDTO, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
