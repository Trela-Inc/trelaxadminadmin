import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const timestamp = new Date().toISOString();
    const path = request.url;
    const method = request.method;

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message = (typeof res === 'string') ? res : (res as any).message || message;
    } else if (exception && typeof exception === 'object' && 'status' in exception) {
      status = (exception as any).status;
      message = (exception as any).message || message;
    }

    this.logger.error(`[${method}] ${path} ${status} - ${JSON.stringify(message)}`);

    response.status(status).json({
      statusCode: status,
      timestamp,
      path,
      message,
    });
  }
} 