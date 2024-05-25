import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

/**
 * Http exception filter for handling all http exceptions with standard response.
 * @class
 * @implements {ExceptionFilter}
 * @version 1.0.0
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  public catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const request = host.switchToHttp().getRequest<Request>();
    const response = host.switchToHttp().getResponse<Response>();
    const status = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;
    const payload = {
      path: request.url,
      timestamp: new Date().toISOString(),
      status: status,
      details: [],
      message: exception.message,
    };

    if (status === HttpStatus.BAD_REQUEST) {
      payload['details'] = exception.response.message;
    }

    httpAdapter.reply(response, payload, status);
  }
}
