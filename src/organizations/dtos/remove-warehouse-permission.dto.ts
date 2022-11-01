import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class RemoveWarehousePermissionDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  warehouseId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
