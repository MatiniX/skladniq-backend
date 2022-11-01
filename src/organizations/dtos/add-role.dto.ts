import { ApiProperty } from '@nestjs/swagger';
import { OraganizationRole } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';

export class AddRoleDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ enum: OraganizationRole })
  @IsEnum(OraganizationRole)
  @IsNotEmpty()
  role: OraganizationRole;
}
