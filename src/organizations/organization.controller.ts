import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators';
import {
  AddMemberDto,
  AddRoleDto,
  CreateOrganizationDto,
  CreateWarehousePermissionDto,
  RemoveMemberDto,
  RemoveRoleDto,
  RemoveWarehousePermissionDto,
  UpdateOrganizationDto,
  UpdateWarehousePermissionDto,
} from './dtos';
import { OrganizationService } from './organization.service';

@ApiTags('organizations')
@ApiBearerAuth()
@Controller('organizations')
export class OrganizationController {
  constructor(private organizationService: OrganizationService) {}

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse()
  createOrganization(@CurrentUser() user, @Body() dto: CreateOrganizationDto) {
    return this.organizationService.createOrganization(user.sub, dto);
  }

  @Patch('/update')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @ApiNotFoundResponse()
  updateOrganization(@Body() dto: UpdateOrganizationDto) {
    return this.organizationService.updateOrganization(dto);
  }

  @Patch('/update-permission')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @ApiNotFoundResponse()
  updateWarehousePermission(@Body() dto: UpdateWarehousePermissionDto) {
    return this.organizationService.updateWarehousePermission(dto);
  }

  @Post('/add-member')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @ApiNotFoundResponse()
  addMember(@Body() dto: AddMemberDto) {
    return this.organizationService.addMember(dto.organizationId, dto.memberId);
  }

  @Post('/add-role')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @ApiNotFoundResponse()
  addRole(@Body() dto: AddRoleDto) {
    return this.organizationService.addRole(dto);
  }

  @Post('/create-permission')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse()
  @ApiBadRequestResponse()
  createWarehousePermission(@Body() dto: CreateWarehousePermissionDto) {
    return this.organizationService.createWarehousePermission(dto);
  }

  @Delete('/remove-permission')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  removeWarehousePermission(@Body() dto: RemoveWarehousePermissionDto) {
    return this.organizationService.removeWarehousePermission(dto);
  }

  @Delete('/remove-member')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @ApiNotFoundResponse()
  removeMember(@Body() dto: RemoveMemberDto) {
    return this.organizationService.removeMember(
      dto.organizationId,
      dto.memberId,
    );
  }
  @Delete('/remove-role')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiBadRequestResponse()
  removeRole(@Body() dto: RemoveRoleDto) {
    return this.organizationService.removeRole(dto);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ name: 'id', description: 'Id of the organization being closed' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  closeOrganization(@Param('id') id: string) {
    return this.organizationService.closeOrganization(id);
  }
}
