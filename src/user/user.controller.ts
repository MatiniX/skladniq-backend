import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { isUUID } from 'class-validator';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':userId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  getUserById(@Param('userId') userId: string) {
    if (!isUUID(userId)) {
      throw new BadRequestException('UserId provided is not in uuid format');
    }

    return this.userService.getUserById(userId);
  }
}
