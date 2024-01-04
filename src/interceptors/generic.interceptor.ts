import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { HTTP_CODE_METADATA, METHOD_METADATA } from '@nestjs/common/constants';
import { Reflector } from '@nestjs/core';
import { Observable, catchError, map, throwError } from 'rxjs';

export interface GenericResponse<T> {
  Success: boolean;
  Data: T | null;
  Status: number;
  ErrorMessages: string[];
}

@Injectable()
export class GenericInterceptor<T>
  implements NestInterceptor<T, GenericResponse<T>>
{
  constructor(private reflector: Reflector) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<GenericResponse<T>> {
    const httpCode = this.reflector.get(METHOD_METADATA, context.getHandler());
    console.log(httpCode);
    return next.handle().pipe(
      map((Data: T) => {
        return {
          Success: true,
          Data,
          Status: HttpStatus.OK,
          ErrorMessages: [],
        };
      }),
      catchError((err) => {
        console.error(err);
        return throwError(() => {
          let message: string | string[] = 'Internal Server Error';
          let status = 500;
          if (err instanceof HttpException) {
            const currResponse = err.getResponse();
            message =
              (typeof currResponse === 'string'
                ? currResponse
                : currResponse['message']) || err.message;
            status = err.getStatus();
          } else if (typeof err === 'string') {
            message = err;
          }
          return new HttpException(
            {
              Success: false,
              Data: null,
              Status: status,
              ErrorMessages: Array.isArray(message) ? message : [message],
            },
            status,
          );
        });
      }),
    );
  }
}
