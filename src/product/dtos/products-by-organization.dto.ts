import { ApiProperty } from '@nestjs/swagger';
import {
  IsBooleanString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class ProductsByOrganizationDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  orgId: string;

  @ApiProperty({ required: false })
  @IsBooleanString()
  @IsOptional()
  includeAttr?: string;
}
