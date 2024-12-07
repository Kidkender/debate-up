import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthRequest } from './../auth-request.interface';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request: AuthRequest = context.switchToHttp().getRequest();
    return request.user.userId;
  },
);
