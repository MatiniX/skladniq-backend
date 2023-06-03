import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class WarehouseProductDto {
  @ApiProperty()
  @IsUUID('all', { message: 'WarehouseId not UUID' })
  @IsNotEmpty()
  warehouseId: string;

  @ApiProperty()
  @IsUUID('all', { message: 'ProductId not UUID' })
  @IsNotEmpty()
  productId: string;
}
