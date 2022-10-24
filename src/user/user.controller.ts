import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { isUUID } from 'class-validator';
import { CreateUserDetailsDto, UpdateUserDetailsDto } from './dtos';
import { UserService } from './user.service';

@ApiTags('user')
@ApiBearerAuth()
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

  @Get('/organization/:organizationId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  getUsersByOrganization(@Param('organizationId') organizationId: string) {
    if (!isUUID(organizationId)) {
      throw new BadRequestException(
        'OrganizationId provided is not in uuid format',
      );
    }

    return this.userService.getUsersByOrganization(organizationId);
  }

  @Post('/user-details')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse()
  createUserDetails(@Body() dto: CreateUserDetailsDto) {
    return this.userService.createUserDetails(dto);
  }

  @Patch('/user-details')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  updateUserDetails(@Body() dto: UpdateUserDetailsDto) {
    return this.userService.updateUserDetails(dto);
  }
}
