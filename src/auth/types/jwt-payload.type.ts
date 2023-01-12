import { OraganizationRole } from '@prisma/client';

export type JwtPayload = {
  email: string;
  sub: string;
  roles: OraganizationRole[];
  organizationId: string;
};
