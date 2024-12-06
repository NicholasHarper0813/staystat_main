import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Error as MongooseError } from 'mongoose';
import { MongoError } from 'mongodb';
import { ThrottlerException } from '@nestjs/throttler';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const context = `${request.method} ${request.url}`;

    let status: number;
    let message: string | object;

    if (exception instanceof ThrottlerException) {
      // Handle ThrottlerException specifically
      status = HttpStatus.TOO_MANY_REQUESTS; // 429 status code
      message =
        'You have exceeded the number of allowed requests. Please try again later.';
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse();
    } else if (exception instanceof MongooseError.ValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = this.formatMongooseValidationError(exception);
    } else if (exception instanceof MongoError) {
      status = this.handleMongoError(exception);
      message = this.formatMongoError(exception);
    } else if (exception instanceof MongooseError) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      context,
    };

    const stack = exception instanceof Error ? exception.stack : undefined;
    this.logger.error(JSON.stringify(errorResponse), stack);
    response.status(status).json(errorResponse);
  }

  formatMongooseValidationError(error: MongooseError.ValidationError): string {
    return Object.values(error.errors)
      .map((err) => err.message)
      .join(', ');
  }

  handleMongoError(error: MongoError): number {
    switch (error.code) {
      case 11000:
        return HttpStatus.CONFLICT;
      case 11001:
        return HttpStatus.NOT_FOUND;
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  formatMongoError(error: MongoError): string {
    switch (error.code) {
      case 11000:
        return 'Unique constraint violation';
      case 11001:
        return 'Record not found';
      default:
        return 'Internal server error';
    }
  }
}
