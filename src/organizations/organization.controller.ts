import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
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
import { CurrentUser, OrganizationRoles } from 'src/common/decorators';
import { OrganizationRolesGuard } from 'src/common/guards/organization-role.guard';
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
import { SetRolesDto } from './dtos/set-roles.dto';

@ApiTags('organizations')
@ApiBearerAuth()
//@UseGuards(OrganizationRolesGuard)
@Controller('organizations')
export class OrganizationController {
  constructor(private organizationService: OrganizationService) {}

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  getOrganizationById(@Param('id') id: string) {
    return this.organizationService.getOrganizationById(id);
  }

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse()
  createOrganization(@CurrentUser() user, @Body() dto: CreateOrganizationDto) {
    return this.organizationService.createOrganization(user.sub, dto);
  }

  @Patch('/update')
  @HttpCode(HttpStatus.OK)
  @OrganizationRoles('organization_manager')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  updateOrganization(@Body() dto: UpdateOrganizationDto) {
    return this.organizationService.updateOrganization(dto);
  }

  @Patch('/update-permission')
  @HttpCode(HttpStatus.OK)
  @OrganizationRoles('warehouse_manager')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  updateWarehousePermission(@Body() dto: UpdateWarehousePermissionDto) {
    return this.organizationService.updateWarehousePermission(dto);
  }

  @Get('/send-invitation/:email')
  @HttpCode(HttpStatus.OK)
  @OrganizationRoles('employee_manager')
  @ApiOkResponse()
  sendInvitation(
    @Param('email') email: string,
    @CurrentUser('organizationId') orgId,
  ) {
    return this.organizationService.sendInvitationEmail(email, orgId);
  }

  @Post('/add-member')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @ApiNotFoundResponse()
  addMember(@Body() dto: AddMemberDto) {
    return this.organizationService.addMember(dto.memberId, dto.organizationId);
  }

  @Post('/add-role')
  @HttpCode(HttpStatus.OK)
  @OrganizationRoles('employee_manager')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  addRole(@Body() dto: AddRoleDto) {
    return this.organizationService.addRole(dto);
  }

  @Post('/set-roles')
  @HttpCode(HttpStatus.OK)
  @OrganizationRoles('employee_manager')
  @ApiOkResponse()
  @ApiNotFoundResponse()
  setRoles(@Body() dto: SetRolesDto) {
    return this.organizationService.setRoles(dto);
  }

  @Post('/create-permission')
  @HttpCode(HttpStatus.CREATED)
  @OrganizationRoles('warehouse_manager')
  @ApiOkResponse()
  @ApiBadRequestResponse()
  createWarehousePermission(@Body() dto: CreateWarehousePermissionDto) {
    return this.organizationService.createWarehousePermission(dto);
  }

  @Delete('/remove-permission')
  @HttpCode(HttpStatus.NO_CONTENT)
  @OrganizationRoles('warehouse_manager')
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  removeWarehousePermission(@Body() dto: RemoveWarehousePermissionDto) {
    return this.organizationService.removeWarehousePermission(dto);
  }

  @Delete('/remove-member')
  @HttpCode(HttpStatus.OK)
  @OrganizationRoles('employee_manager')
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
  @OrganizationRoles('employee_manager')
  @ApiNoContentResponse()
  @ApiBadRequestResponse()
  removeRole(@Body() dto: RemoveRoleDto) {
    return this.organizationService.removeRole(dto);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @OrganizationRoles('owner')
  @ApiParam({ name: 'id', description: 'Id of the organization being closed' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  closeOrganization(@Param('id') id: string) {
    return this.organizationService.closeOrganization(id);
  }
}
