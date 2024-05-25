import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { AuthRequest } from '../auth.type';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

/**
 * Guard responsible for authentication check.
 * @version 1.0.0
 * @class
 * @see JwtService
 * @see Reflector
 * @see ExecutionContext
 * @see Request
 * @see IS_PUBLIC_KEY
 * @see Public
 * @see CanActivate
 */
@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(
    protected readonly jwtService: JwtService,
    protected readonly reflector: Reflector,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    // If public key is set, immediately return true.
    if (this.reflector.get<boolean>(IS_PUBLIC_KEY, context.getHandler()))
      return true;

    const request: AuthRequest = context.switchToHttp().getRequest();
    const token = this.extractAuthBearerToken(request);
    if (!token) return false;

    try {
      const payload = await this.jwtService.verifyAsync(token);
      if (payload['type'] !== 'access') return false;
      request.user = payload;
      return true;
    } catch (e) {
      return false;
    }
  }

  private extractAuthBearerToken(request: AuthRequest): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader) return null;

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer') return null;

    return token;
  }
}
