import { ApiProperty } from '@nestjs/swagger';
import { StorageUnit } from '@prisma/client';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsPositive,
  IsUUID,
} from 'class-validator';

export class AddProductAttributeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: StorageUnit })
  @IsEnum(StorageUnit)
  @IsNotEmpty()
  unit: StorageUnit;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  valuePerStorageUnit: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  displayValue: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  metricUnit: number;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  productId: string;
}
