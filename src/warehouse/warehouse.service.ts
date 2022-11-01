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
  constructor(private prisma: PrismaService) {}

  async createWarehouse(dto: CreateWarehouseDto) {
    try {
      const newWarehouse = await this.prisma.warehouse.create({
        data: {
          name: dto.name,
          address: {
            connect: {
              id: dto.addressId,
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
    });

    if (!warehouseProduct) {
      throw new NotFoundException('Ther is not such product in this warehouse');
    }

    return warehouseProduct;
  }
}
