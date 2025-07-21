import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../modules/users/entities/user.model';
import { Request } from 'express';

export const UserDecorator = createParamDecorator(
  (
    field: keyof User | undefined,
    ctx: ExecutionContext,
  ): User[keyof User] | User | undefined => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user;
    return field ? user?.[field] : user;
  },
);
