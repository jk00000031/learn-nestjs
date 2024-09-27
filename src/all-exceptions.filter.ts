import { Catch, ArgumentsHost, HttpStatus, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { MyLoggerService } from './my-logger/my-logger.service';
import { PrismaClientInitializationError, PrismaClientValidationError } from '@prisma/client/runtime/library';

type MyResponseObj = {
  code: number;
  timestamp: string;
  path: string;
  response: string | object;
};

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new MyLoggerService(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode: number = 500;
    const myResponseObj: MyResponseObj = {
      code: 500,
      timestamp: new Date().toISOString(),
      path: request.url,
      response: '',
    };

    if (exception instanceof HttpException) {
      myResponseObj.code = statusCode = exception.getStatus();
      myResponseObj.response = exception.getResponse();
    } else if (exception instanceof PrismaClientValidationError) {
      myResponseObj.code = statusCode = 400;
      myResponseObj.response = exception.message.replaceAll(/\n/g, '');
    } else if (exception instanceof PrismaClientInitializationError) {
      statusCode = 400;
      myResponseObj.code = 42601;
      myResponseObj.response = '数据库出现连接错误';
    } else {
      myResponseObj.code = statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      myResponseObj.response = 'Internal Server Error';
    }

    response.status(statusCode).json(myResponseObj);
    this.logger.error(myResponseObj.response);

    super.catch(exception, host);
  }
}
