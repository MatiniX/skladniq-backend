import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import {
  CreateUserDetailsDto,
  UpdateUserDetailsDto,
  UserDetailsDto,
} from './dtos';
import { UserService } from './user.service';

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/user-details/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @ApiNotFoundResponse({ description: 'User does not exists' })
  getUserById(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.userService.getUserById(userId);
  }

  @Get('/user-details')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserDetailsDto })
  getUserDetails(@CurrentUser('sub') userId): Promise<UserDetailsDto> {
    return this.userService.getUserDetails(userId);
  }

  @Get('/user-invites')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  getUserInvites(@CurrentUser('sub') userId) {
    return this.userService.getUserInvites(userId);
  }

  @Get('/organization/:organizationId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  getUsersByOrganization(
    @Param('organizationId', ParseUUIDPipe) organizationId: string,
  ) {
    return this.userService.getUsersByOrganization(organizationId);
  }

  @Get('/warehouse-permissions/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  getUserWarehousePermission(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.userService.getUserWarehousePermissions(userId);
  }

  @Post('/user-details')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse()
  createUserDetails(
    @Body() dto: CreateUserDetailsDto,
    @CurrentUser('sub') userId,
  ) {
    return this.userService.createUserDetails(dto, userId);
  }

  @Patch('/user-details')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  updateUserDetails(
    @Body() dto: UpdateUserDetailsDto,
    @CurrentUser('sub') userId,
  ) {
    return this.userService.updateUserDetails(dto, userId);
  }
}
