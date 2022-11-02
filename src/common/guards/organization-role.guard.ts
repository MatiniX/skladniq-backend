import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { OraganizationRole } from '@prisma/client';
import { Request } from 'express';
import { JwtPayloadWithRt } from 'src/auth/types';
import { ROLES_KEY } from '../decorators';

@Injectable()
export class OrganizationRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<OraganizationRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    const user: JwtPayloadWithRt = context.switchToHttp().getRequest().user;
    const reqBody = context.switchToHttp().getRequest<Request>().body;

    if (reqBody && reqBody.hasOwnProperty('organizationId')) {
      if (reqBody.organizationId !== user.organizationId) {
        return false;
      }
    }

    if (!requiredRoles || user.roles.includes('owner')) {
      return true;
    }

    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
