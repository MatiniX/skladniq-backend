import { ApiProperty } from '@nestjs/swagger';
import { OraganizationRole } from '@prisma/client';
import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class CurrentUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  sub: string;

  @ApiProperty()
  roles: OraganizationRole[];

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  organizationId: string;
}
