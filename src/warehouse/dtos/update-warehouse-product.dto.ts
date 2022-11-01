import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';

export class UpdateWarehouseProductDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  warehouseId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  unitsInStock: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  maxCapacity: number;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  unlimitedCapacity: boolean;
}
