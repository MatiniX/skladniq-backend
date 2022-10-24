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
  CreateOrganizationDto,
  RemoveMemberDto,
  UpdateOrganizationDto,
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

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ name: 'id', description: 'Id of the organization being closed' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  closeOrganization(@Param('id') id: string) {
    return this.organizationService.closeOrganization(id);
  }

  @Post('/addMemebr')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @ApiNotFoundResponse()
  addMember(@Body() dto: AddMemberDto) {
    return this.organizationService.addMember(dto.organizationId, dto.memberId);
  }

  @Patch('/removeMember')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @ApiNotFoundResponse()
  removeMember(@Body() dto: RemoveMemberDto) {
    return this.organizationService.removeMember(
      dto.organizationId,
      dto.memberId,
    );
  }
}
