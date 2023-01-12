import { SetMetadata } from '@nestjs/common';
import { Permission } from '@prisma/client';

export const PERMISSIONS_KEY = 'permissions';
export const WarehousePermissions = (...permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
