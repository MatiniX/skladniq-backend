import { ApiProperty } from '@nestjs/swagger';
import { OraganizationRole } from '@prisma/client';
import { IsUUID, IsNotEmpty, IsEnum } from 'class-validator';

export class RemoveRoleDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ enum: OraganizationRole })
  @IsEnum(OraganizationRole)
  @IsNotEmpty()
  role: OraganizationRole;
}
