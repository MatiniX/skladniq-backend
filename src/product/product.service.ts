import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AddProductAttributeDto,
  CreateProductDto,
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
}
