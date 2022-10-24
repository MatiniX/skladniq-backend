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
import { CreateAddressDto } from './dtos';
import { UpdateAddressDto } from './dtos/update-address.dto';

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

  @Patch('/update')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @ApiNotFoundResponse()
  updateAddress(@Body() dto: UpdateAddressDto) {
    return this.addressService.updateAddress(dto);
  }
}
