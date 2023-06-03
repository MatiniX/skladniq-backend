import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import e from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AddProductAttributeDto,
  CreateProductDto,
  UpdateProductAttributeDto,
  UpdateProductDto,
} from './dtos';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async getProductById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        attributes: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product does not exists');
    }

    return product;
  }

  async getProductsByOrganization(
    organizationId: string,
    includeAttributes = false,
  ) {
    const organizationProducts = await this.prisma.product.findMany({
      where: {
        organizationId,
      },
      include: {
        attributes: includeAttributes,
      },
    });

    return organizationProducts;
  }

  async createProduct(dto: CreateProductDto) {
    const newProduct = await this.prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description,
        metricUnit: dto.metricUnit,
        storageUnit: dto.storageUnit,
        organization: {
          connect: {
            id: dto.organizationId,
          },
        },
      },
    });

    return newProduct;
  }

  async updateProduct(dto: UpdateProductDto) {
    const updatedProduct = await this.prisma.product.update({
      where: {
        id: dto.id,
      },
      data: {
        name: dto.name,
        description: dto.description,
        metricUnit: dto.metricUnit,
        storageUnit: dto.storageUnit,
      },
    });

    return updatedProduct;
  }

  async addProductAttribute(dto: AddProductAttributeDto) {
    try {
      const productAttribute = await this.prisma.productAttribute.create({
        data: {
          name: dto.name,
          displayValue: dto.displayValue,
          metricUnit: dto.metricUnit,
          unit: dto.unit,
          valuePerStorageUnit: dto.valuePerStorageUnit,
          product: {
            connect: { id: dto.productId },
          },
        },
      });

      return productAttribute;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateProductAttribute(dto: UpdateProductAttributeDto) {
    try {
      const updatedAttribute = await this.prisma.productAttribute.update({
        where: { id: dto.id },
        data: {
          name: dto.name,
          metricUnit: dto.metricUnit,
          displayValue: dto.displayValue,
          unit: dto.unit,
          valuePerStorageUnit: dto.valuePerStorageUnit,
        },
      });
      return updatedAttribute;
    } catch (error) {
      if (error.code === 'P2025') {
        this.addProductAttribute({
          displayValue: dto.displayValue,
          metricUnit: dto.metricUnit,
          name: dto.name,
          productId: dto.productId,
          unit: dto.unit,
          valuePerStorageUnit: dto.valuePerStorageUnit,
        });
      } else {
        throw new BadRequestException(error);
      }
    }
  }

  async removeProductAttribute(attributeId: string) {
    try {
      await this.prisma.productAttribute.delete({
        where: {
          id: attributeId,
        },
      });

      return true;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async removeProduct(productId: string) {
    try {
      const deletedProduct = await this.prisma.product.delete({
        where: { id: productId },
      });
      return deletedProduct;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
