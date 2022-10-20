import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayloadWithRt } from 'src/auth/types';

export const CurrentUser = createParamDecorator(
  (data: keyof JwtPayloadWithRt, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: JwtPayloadWithRt = request.user;

    return data ? user?.[data] : user;
  },
);
