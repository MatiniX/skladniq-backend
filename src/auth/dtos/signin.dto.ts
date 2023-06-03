import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({ default: 'mato.michalik10@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ default: 'mato' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
