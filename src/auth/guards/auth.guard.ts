import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { NO_ACCOUNT_GUARD_KEY } from '../decorators/no-account-guard.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { AuthRequest } from '../auth-request.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const noAccountGuard = this.reflector.getAllAndOverride<boolean>(
      NO_ACCOUNT_GUARD_KEY,
      [context.getHandler(), context.getClass()],
    );

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic || noAccountGuard) {
      return true;
    }
    const request: AuthRequest = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException(`Invalid token`);
    }

    try {
      const payload = this.jwtService.verify(token);
      request.user = { userId: payload.userId, role: payload.role };
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        Logger.error('Token has expired');
        throw new UnauthorizedException('Token expired');
      } else if (e.name === 'JsonWebTokenError') {
        Logger.error('Invalid token format');
        throw new UnauthorizedException('Invalid token');
      } else {
        Logger.error('Unknown token error');
        throw new UnauthorizedException('Invalid token');
      }
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    return request.headers.authorization?.split(' ')[1];
  }
}
