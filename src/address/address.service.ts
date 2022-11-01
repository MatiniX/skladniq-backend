import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAddressDto } from './dtos';
import { UpdateAddressDto } from './dtos/update-address.dto';

@Injectable()
export class AddressService {
  constructor(private prisma: PrismaService) {}

  async createAddressForOrganization(dto: CreateAddressDto) {
    const newAddress = await this.prisma.address.create({
      data: {
        country: dto.country,
        region: dto.region,
        city: dto.city,
        streetAddress: dto.streetAddress,
        postcode: dto.postcode,
        organization: {
          connect: {
            id: dto.objectId,
          },
        },
      },
    });

    return newAddress;
  }

  async createAddressForWarehouse(dto: CreateAddressDto) {
    const newAddress = await this.prisma.address.create({
      data: {
        country: dto.country,
        region: dto.region,
        city: dto.city,
        streetAddress: dto.streetAddress,
        postcode: dto.postcode,
        warehouse: {
          connect: {
            id: dto.objectId,
          },
        },
      },
    });

    return newAddress;
  }

  async updateAddress(dto: UpdateAddressDto) {
    const { city, country, id, postcode, region, streetAddress } = dto;
    try {
      const updatedAddress = await this.prisma.address.update({
        where: { id },
        data: {
          country,
          region,
          city,
          postcode,
          streetAddress,
        },
      });

      return updatedAddress;
    } catch (error) {
      throw new NotFoundException('Address with this id does not exists');
    }
  }
}
