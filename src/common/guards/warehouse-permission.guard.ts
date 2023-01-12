import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission } from '@prisma/client';
import { JwtPayload } from 'src/auth/types';
import { PrismaService } from 'src/prisma/prisma.service';
import { PERMISSIONS_KEY } from '../decorators/warehouse-permission.decorator';

@Injectable()
export class WarehouseGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user: JwtPayload = req.user;
    if (!user) {
      throw new ForbiddenException('You must be signed in');
    }

    if (
      user.roles.includes('owner') ||
      user.roles.includes('warehouse_manager')
    ) {
      return true;
    }

    let warehouseId: string;

    if (req.params.hasOwnProperty('warehouseId')) {
      warehouseId = req.params.warehouseId;
    } else if (req.query.hasOwnProperty('warehouseId')) {
      warehouseId = req.query.warehouseId;
    } else {
      warehouseId = req.body.warehouseId;
    }
    if (!warehouseId) {
      throw new ForbiddenException(
        'There is no associated warehouse to this request',
      );
    }

    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getClass(), context.getHandler()],
    );

    const userPermissions = await this.prisma.warehousePermission.findMany({
      where: {
        userId: user.sub,
      },
    });

    return (
      userPermissions.filter((p) => requiredPermissions.includes(p.permission))
        .length > 0
    );
  }
}
