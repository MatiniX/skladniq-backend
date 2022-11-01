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

export class UpdateProductDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ enum: StorageUnit })
  @IsNotEmpty()
  @IsEnum(StorageUnit)
  storageUnit: StorageUnit;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  metricUnit: number;
}
