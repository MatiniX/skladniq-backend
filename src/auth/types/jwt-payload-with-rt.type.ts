import { OraganizationRole } from '@prisma/client';

export type JwtPayloadWithRt = {
  email: string;
  sub: number;
  roles: OraganizationRole[];
  organizationId: string;
  refreshToken: string;
};
