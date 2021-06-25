import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../roles/role.enum';
import { ROLES_KEY } from '../roles/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    //  Role required?
    if (!requiredRoles) {
      return true;
    }

    //  Get user from the request
    const { user } = context.switchToHttp().getRequest();

    //  Check if the user has the required roles
    return requiredRoles.some((role) => user?.roles?.includes(role));
  }
}
