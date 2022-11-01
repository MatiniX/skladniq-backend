import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { StorageUnit } from '@prisma/client';

export class CreateProductDto {
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

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  organizationId: string;
}
