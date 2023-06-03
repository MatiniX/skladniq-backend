import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AddWarehouseProductDto,
  CreateWarehouseDto,
  RemoveWarehouseProductDto,
  UpdateWarehouseDto,
  UpdateWarehouseProductDto,
} from './dtos';

@Injectable()
export class WarehouseService {
  async getWarehouseById(id: string) {
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id },
      include: { address: true },
    });

    return warehouse;
  }

  async getWarehousesByOrganization(organizationId: string) {
    const allWarehouses = await this.prisma.warehouse.findMany({
      where: {
        organizationId,
      },
      include: {
        address: true,
      },
    });

    return allWarehouses;
  }
  constructor(private prisma: PrismaService) {}

  async createWarehouse(dto: CreateWarehouseDto) {
    try {
      const newWarehouse = await this.prisma.warehouse.create({
        data: {
          name: dto.name,
          address: {
            create: {
              country: dto.country,
              region: dto.region,
              city: dto.city,
              streetAddress: dto.streetAddress,
              postcode: dto.postcode,
            },
          },
          organization: {
            connect: {
              id: dto.organizationId,
            },
          },
        },
      });

      return newWarehouse;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateWarehouse(dto: UpdateWarehouseDto) {
    try {
      const updatedWarehouse = await this.prisma.warehouse.update({
        where: { id: dto.id },
        data: {
          name: dto.name,
          active: dto.active,
        },
      });

      return updatedWarehouse;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async closeWarehouse(warehouseId: string) {
    try {
      await this.prisma.warehouse.update({
        where: {
          id: warehouseId,
        },
        data: {
          active: false,
        },
      });

      return true;
    } catch (error) {
      throw new BadRequestException('Warehouse does not exists');
    }
  }

  async addWarehouseProduct(dto: AddWarehouseProductDto) {
    try {
      const newWarehouseProduct = await this.prisma.warehouseProduct.create({
        data: {
          unitsInStock: dto.unitsInStock,
          maxCapacity: dto.maxCapacity,
          unlimitedCapacity: dto.unlimitedCapacity,
          warehouse: {
            connect: {
              id: dto.warehouseId,
            },
          },
          product: {
            connect: {
              id: dto.productId,
            },
          },
        },
      });

      return newWarehouseProduct;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateWarehouseProduct(dto: UpdateWarehouseProductDto) {
    try {
      const updatedWarehouseProduct = await this.prisma.warehouseProduct.update(
        {
          where: {
            warehouseId_productId: {
              productId: dto.productId,
              warehouseId: dto.warehouseId,
            },
          },
          data: {
            unitsInStock: dto.unitsInStock,
            maxCapacity: dto.maxCapacity,
            unlimitedCapacity: dto.unlimitedCapacity,
          },
        },
      );

      return updatedWarehouseProduct;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async removeWarehouseProduct(dto: RemoveWarehouseProductDto) {
    await this.prisma.warehouseProduct.delete({
      where: {
        warehouseId_productId: {
          productId: dto.productId,
          warehouseId: dto.warehouseId,
        },
      },
    });

    return true;
  }

  async getAllWarehouseProducts(warehouseId: string) {
    const allProducts = await this.prisma.warehouseProduct.findMany({
      where: {
        warehouseId,
      },
      include: {
        product: true,
      },
    });

    return allProducts;
  }

  async getWarehouseProduct(warehouseId: string, productId: string) {
    const warehouseProduct = await this.prisma.warehouseProduct.findUnique({
      where: {
        warehouseId_productId: {
          warehouseId,
          productId,
        },
      },
      include: {
        product: { include: { attributes: true } },
        warehouse: true,
      },
    });

    if (!warehouseProduct) {
      throw new NotFoundException(
        'There is not such product in this warehouse',
      );
    }

    return warehouseProduct;
  }
}
