import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Injectable,
  NestInterceptor,
  CallHandler,
  UnauthorizedException,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import whiteList from '../constants/whiteList';
import dayjs = require('dayjs');

@Catch(HttpException)
export class HttpFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    response.status(status).json({
      data: exception.message,
      time: new Date().getTime(),
      success: false,
      path: request.url,
      status,
    });
  }
}

interface data<T> {
  data: T;
}

@Injectable()
export class ResponseFun<T = any> implements NestInterceptor {
  constructor(private jwt: JwtService) {}
  intercept(context, next: CallHandler): Observable<data<T>> {
    const authorization: any = this.jwt.decode(
      context.switchToHttp().getRequest().headers.authorization?.split('Bearer ')?.[1],
    );
    
    if (
      whiteList.findIndex(
        (item) => item === context.switchToHttp().getRequest().route.path,
      ) >= 0
    ) {
      return next.handle().pipe(
        map((resData = {}) => {
          return {
            data: resData?.data || null,
            status: 'ok',
            success: true,
            message: resData?.message || '成功',
          };
        }),
      );
    }

    if (
      !authorization ||
      !authorization.expirationTime ||
      dayjs().valueOf() > dayjs(authorization?.expirationTime)?.valueOf()
    ) {
      throw new UnauthorizedException('请重新登录');
    }

    return next.handle().pipe(
      map((resData = {}) => {
        const { data = null, message = '成功', ...others } =resData
        return {
          data,
          status: 'ok',
          success: true,
          message,
          ...others
        };
      }),
    );
  }
}
