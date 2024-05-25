import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { Role } from '../role.enum';

/**
 * Guard responsible for role check.
 * @version 1.0.0
 * @class
 * @see Reflector
 * @see ExecutionContext
 * @see CanActivate
 * @see Role
 */
@Injectable()
export class RoleGuard extends AuthGuard {
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    if (!(await super.canActivate(context))) return false;

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;
    const { user } = context.switchToHttp().getRequest();

    // If user is admin, he is fully authorized to do everything.
    // Otherwise, check if user has required role.
    return (
      requiredRoles.some((role) => user.roles?.includes(role)) ||
      user.roles?.includes(Role.ADMIN)
    );
  }
}
