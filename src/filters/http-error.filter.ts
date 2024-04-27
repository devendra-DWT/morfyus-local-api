import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql/type';

@Catch(HttpException)
export class HttpErrorFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();

    // Handle http exception
    if (request) {
      return this.handleHttpException(ctx.getResponse<Response>(), exception);
    }

    return this.handleGraphqlException(exception);
  }

  private handleHttpException(response: Response, exception: HttpException) {
    const code = exception.getStatus();
    const message = exception.message;

    const frontendUrl = this.configService.get<string>('frontend_url');
    switch (code) {
      case 403:
        return response.redirect(frontendUrl + `/error?message=${message}`);
      case 404:
        return response.redirect(frontendUrl + '/errors/404');
    }

    response.status(code).json({
      statusCode: code,
      message: message,
    });
  }

  private handleGraphqlException(exception: HttpException) {
    return exception;
  }
}
