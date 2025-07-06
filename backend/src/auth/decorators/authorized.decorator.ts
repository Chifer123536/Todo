import { User } from '@/schemas/user.schema';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthoRized = createParamDecorator(
  (data: keyof User, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user[data] : user;
  }
);
