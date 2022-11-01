import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class AddWarehouseProductDto {
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
