import { SetMetadata } from '@nestjs/common';
import { OraganizationRole } from '@prisma/client';

export const ROLES_KEY = 'orgRoles';
export const OrganizationRoles = (...roles: OraganizationRole[]) =>
  SetMetadata(ROLES_KEY, roles);
