import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
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
import { AddressService } from './address.service';
import { CreateAddressDto, UpdateAddressDto } from './dtos';

@ApiTags('address')
@ApiBearerAuth()
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse()
  createAddress(@Body() dto: CreateAddressDto) {
    return this.addressService.createAddress(dto);
  }
  @Post('/organization/create')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse()
  createAddressForOrganization(@Body() dto: CreateAddressDto) {
    return this.addressService.createAddressForOrganization(dto);
  }

  @Post('/warehouse/create')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse()
  createAddressForWarehouse(@Body() dto: CreateAddressDto) {
    return this.addressService.createAddressForWarehouse(dto);
  }

  @Patch('/update')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @ApiNotFoundResponse()
  updateAddress(@Body() dto: UpdateAddressDto) {
    return this.addressService.updateAddress(dto);
  }
}
