import { OraganizationRole } from '@prisma/client';

export type JwtPayload = {
  email: string;
  sub: number;
  roles: OraganizationRole[];
  organizationId: string;
};
