import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '@/shared/enums';

@Injectable()
export class RolesGuard implements CanActivate {
  public constructor(private readonly reflector: Reflector) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    const request = context.switchToHttp().getRequest();

    if (!roles) return true;

    if (!roles.includes(request.user.role)) {
      throw new ForbiddenException(
        'Insufficient permissions. You do not have access to this resource.'
      );
    }

    return true;
  }
}
