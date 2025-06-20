import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException
} from '@nestjs/common';

import { UserService } from '@/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authState = request.session.authState;
    // 1) Нет userId:
    if (typeof request.session.userId === 'undefined') {
      if (authState === 'pending2FA') {
        throw new UnauthorizedException('Pending2FA');
      }
      throw new UnauthorizedException(
        'User is not authorized. Please log in to access.'
      );
    }

    // 2) userId есть → загружаем user
    const user = await this.userService.findById(request.session.userId);
    if (!user) {
      throw new UnauthorizedException('User not found. Please log in again.');
    }
    request.user = user;
    return true;
  }
}
