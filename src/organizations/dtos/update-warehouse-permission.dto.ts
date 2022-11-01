import { ApiProperty } from '@nestjs/swagger';
import { Permission } from '@prisma/client';
import { IsUUID, IsNotEmpty, IsEnum } from 'class-validator';

export class UpdateWarehousePermissionDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  warehouseId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ enum: Permission })
  @IsEnum(Permission)
  @IsNotEmpty()
  permission: Permission;
}
