import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
  RequestMethod,
} from '@nestjs/common';
import { HTTP_CODE_METADATA, METHOD_METADATA } from '@nestjs/common/constants';
import { Reflector } from '@nestjs/core';
import { ApiProperty } from '@nestjs/swagger';
import { Observable, catchError, map, of, throwError } from 'rxjs';

export interface GenericResponseInterface<T> {
  Success: boolean;
  Data: T | null;
  Status: number;
  ErrorMessages: string[];
}

export class GenericResponseClass<T> implements GenericResponseInterface<T> {
  @ApiProperty()
  Success: boolean;
  Data: T;
  @ApiProperty()
  Status: number;
  @ApiProperty()
  ErrorMessages: string[];
}

@Injectable()
export class GenericInterceptor<T>
  implements NestInterceptor<T, GenericResponseInterface<T>>
{
  constructor(private reflector: Reflector) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<GenericResponseInterface<T>> {
    const httpCode = this.reflector.get(
      HTTP_CODE_METADATA,
      context.getHandler(),
    );
    const method = this.reflector.get(METHOD_METADATA, context.getHandler());
    const appropriateResponseStatus = {
      [RequestMethod.GET]: HttpStatus.OK,
      [RequestMethod.POST]: HttpStatus.CREATED,
      [RequestMethod.PATCH]: HttpStatus.CREATED,
      [RequestMethod.PUT]: HttpStatus.OK,
      [RequestMethod.DELETE]: HttpStatus.OK,
    };
    if (
      context
        .switchToHttp()
        .getRequest()
        .originalUrl.includes('/transaction/generate-receipt')
    ) {
      return next.handle();
    }
    return next.handle().pipe(
      map((Data: T) => {
        return {
          Success: true,
          Data,
          Status: httpCode ?? appropriateResponseStatus[method],
          ErrorMessages: [],
        };
      }),
      catchError((err) => {
        console.log(err);
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
        return of({
          Success: false,
          Data: null,
          Status: status,
          ErrorMessages: Array.isArray(message) ? message : [message],
        });
      }),
    );
  }
}
