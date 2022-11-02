import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseBoolPipe,
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
} from '@nestjs/swagger';
import { OrganizationRoles } from 'src/common/decorators';
import { OrganizationRolesGuard } from 'src/common/guards/organization-role.guard';
import { toBoolean } from 'src/common/helpers';
import {
  AddProductAttributeDto,
  CreateProductDto,
  ProductsByOrganizationDto,
  UpdateProductDto,
} from './dtos';
import { ProductService } from './product.service';

@ApiTags('product')
@ApiBearerAuth()
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  getProductsByOrganization(@Query() query: ProductsByOrganizationDto) {
    return this.productService.getProductsByOrganization(
      query.orgId,
      toBoolean(query.includeAttr),
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  getProductById(@Param('id', ParseUUIDPipe) productId: string) {
    return this.productService.getProductById(productId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(OrganizationRolesGuard)
  @OrganizationRoles('product_manager')
  @ApiCreatedResponse()
  createProduct(@Body() dto: CreateProductDto) {
    return this.productService.createProduct(dto);
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  @UseGuards(OrganizationRolesGuard)
  @OrganizationRoles('product_manager')
  @ApiOkResponse()
  updateProduct(@Body() dto: UpdateProductDto) {
    return this.productService.updateProduct(dto);
  }

  @Post('attribute')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(OrganizationRolesGuard)
  @OrganizationRoles('product_manager')
  @ApiCreatedResponse()
  addProductAttribute(@Body() dto: AddProductAttributeDto) {
    return this.productService.addProductAttribute(dto);
  }

  @Delete('attribute/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(OrganizationRolesGuard)
  @OrganizationRoles('product_manager')
  @ApiNoContentResponse()
  removeProductAttribute(@Param('id', ParseUUIDPipe) attributeId: string) {
    return this.productService.removeProductAttribute(attributeId);
  }
}
