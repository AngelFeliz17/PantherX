
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'generated/prisma/browser';

export const GetUser = createParamDecorator(
  (data: keyof User, ctx: ExecutionContext) => {
    const request: Express.Request  = ctx.switchToHttp().getRequest();
    if(data) request.user![data];
    return request.user;
  },
);