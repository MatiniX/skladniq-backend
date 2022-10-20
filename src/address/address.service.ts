import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAddressDto } from './dtos';

@Injectable()
export class AddressService {
  constructor(private prisma: PrismaService) {}

  async createAddress(dto: CreateAddressDto) {
    const newAddress = await this.prisma.address.create({
      data: {
        country: dto.country,
        region: dto.region,
        city: dto.city,
        streetAddress: dto.streetAddress,
        postcode: dto.postcode,
      },
    });

    return newAddress;
  }
}
