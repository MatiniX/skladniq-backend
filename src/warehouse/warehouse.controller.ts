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
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiParam,
} from '@nestjs/swagger';
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

  @Get('/product/:warehouseId')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'warehouseId', schema: {} })
  @ApiOkResponse()
  getAllWarehouseProducts(@Param('warehouseId', ParseUUIDPipe) warehouseId) {
    return this.warehouseService.getAllWarehouseProducts(warehouseId);
  }

  @Get('product')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  getWarehouseProduct(@Query() query: WarehouseProductDto) {
    return this.warehouseService.getWarehouseProduct(
      query.warehouseId,
      query.productId,
    );
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse()
  createWarehouse(@Body() dto: CreateWarehouseDto) {
    return this.warehouseService.createWarehouse(dto);
  }

  @Post('product')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse()
  addWarehouseProduct(@Body() dto: AddWarehouseProductDto) {
    return this.warehouseService.addWarehouseProduct(dto);
  }

  @Patch('update')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  updateWarehouse(@Body() dto: UpdateWarehouseDto) {
    return this.warehouseService.updateWarehouse(dto);
  }

  @Patch('product')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  updateWarehouseProduct(@Body() dto: UpdateWarehouseProductDto) {
    return this.warehouseService.updateWarehouseProduct(dto);
  }

  @Delete('close/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  closeWarehouse(@Param('id', ParseUUIDPipe) warehouseId: string) {
    return this.warehouseService.closeWarehouse(warehouseId);
  }

  @Delete('product')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  removeWarehouseProduct(@Body() dto: RemoveWarehouseProductDto) {
    return this.warehouseService.removeWarehouseProduct(dto);
  }
}
