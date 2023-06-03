import { ApiProperty } from '@nestjs/swagger';
import { OraganizationRole } from '@prisma/client';
import { IsArray, IsEnum, IsNotEmpty, IsUUID } from 'class-validator';

export class SetRolesDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ enum: OraganizationRole, isArray: true })
  @IsNotEmpty()
  @IsArray()
  roles: OraganizationRole[];
}
