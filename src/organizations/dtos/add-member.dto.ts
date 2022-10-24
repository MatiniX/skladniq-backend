import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class AddMemberDto {
  @ApiProperty()
  @IsString()
  @IsUUID()
  organizationId: string;

  @ApiProperty()
  @IsString()
  @IsUUID()
  memberId: string;
}
