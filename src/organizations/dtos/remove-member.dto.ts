import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class RemoveMemberDto {
  @ApiProperty()
  @IsString()
  @IsUUID()
  organizationId: string;

  @ApiProperty()
  @IsString()
  @IsUUID()
  memberId: string;
}
