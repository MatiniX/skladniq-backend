import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiParam,
} from '@nestjs/swagger';
import { OrganizationRoles, WarehousePermissions } from 'src/common/decorators';
import { WarehouseGuard } from 'src/common/guards';
import { OrganizationRolesGuard } from 'src/common/guards/organization-role.guard';
import {
  AddWarehouseProductDto,
  CreateWarehouseDto,
  RemoveWarehouseProductDto,
  UpdateWarehouseDto,
  UpdateWarehouseProductDto,
  WarehouseProductDto,
} from './dtos';
import { WarehouseService } from './warehouse.service';

@ApiTags('warehouse')
@ApiBearerAuth()
@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Get('/organization/:organizationId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @ApiParam({ name: 'organizationId', schema: {} })
  getWarehousesByOrgnaization(
    @Param('organizationId', ParseUUIDPipe) organizationId,
  ) {
    return this.warehouseService.getWarehousesByOrganization(organizationId);
  }

  @Get('/product/:warehouseId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(WarehouseGuard)
  @WarehousePermissions('read', 'full', 'edit_settings', 'edit_inventory')
  @ApiParam({ name: 'warehouseId', schema: {} })
  @ApiOkResponse()
  getAllWarehouseProducts(@Param('warehouseId', ParseUUIDPipe) warehouseId) {
    return this.warehouseService.getAllWarehouseProducts(warehouseId);
  }

  @Get('product')
  @HttpCode(HttpStatus.OK)
  @UseGuards(WarehouseGuard)
  @WarehousePermissions('read', 'full', 'edit_settings', 'edit_inventory')
  @ApiOkResponse()
  getWarehouseProduct(@Query() query: WarehouseProductDto) {
    return this.warehouseService.getWarehouseProduct(
      query.warehouseId,
      query.productId,
    );
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(OrganizationRolesGuard)
  @OrganizationRoles('warehouse_manager')
  @ApiCreatedResponse()
  createWarehouse(@Body() dto: CreateWarehouseDto) {
    return this.warehouseService.createWarehouse(dto);
  }

  @Post('product')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(WarehouseGuard)
  @WarehousePermissions('full', 'edit_inventory')
  @ApiCreatedResponse()
  addWarehouseProduct(@Body() dto: AddWarehouseProductDto) {
    return this.warehouseService.addWarehouseProduct(dto);
  }

  @Patch('update')
  @HttpCode(HttpStatus.OK)
  @UseGuards(WarehouseGuard)
  @WarehousePermissions('full', 'edit_settings')
  @ApiOkResponse()
  updateWarehouse(@Body() dto: UpdateWarehouseDto) {
    return this.warehouseService.updateWarehouse(dto);
  }

  @Patch('product')
  @HttpCode(HttpStatus.OK)
  @UseGuards(WarehouseGuard)
  @WarehousePermissions('full', 'edit_inventory')
  @ApiOkResponse()
  updateWarehouseProduct(@Body() dto: UpdateWarehouseProductDto) {
    return this.warehouseService.updateWarehouseProduct(dto);
  }

  @Delete('close/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(OrganizationRolesGuard)
  @OrganizationRoles('warehouse_manager')
  @ApiNoContentResponse()
  closeWarehouse(@Param('id', ParseUUIDPipe) warehouseId: string) {
    return this.warehouseService.closeWarehouse(warehouseId);
  }

  @Delete('product')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(WarehouseGuard)
  @WarehousePermissions('full', 'edit_inventory')
  @ApiNoContentResponse()
  removeWarehouseProduct(@Body() dto: RemoveWarehouseProductDto) {
    return this.warehouseService.removeWarehouseProduct(dto);
  }
}
