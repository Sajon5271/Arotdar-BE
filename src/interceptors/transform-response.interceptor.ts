import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Observable, map } from 'rxjs';

interface ClassConstructor {
  new (...args: any[]): unknown;
}

export function ValidateOutgoing(validateAgainst: ClassConstructor) {
  return UseInterceptors(new TransformResponseInterceptor(validateAgainst));
}
export class TransformResponseInterceptor implements NestInterceptor {
  constructor(private transformeTo: ClassConstructor) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return plainToInstance(this.transformeTo, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
