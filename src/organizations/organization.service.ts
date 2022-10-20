import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { CreateOrganizationDto } from './dtos';

@Injectable()
export class OrganizationService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async createOrganization(userId: string, dto: CreateOrganizationDto) {
    // check if user has an exisiting organization
    const user = await this.userService.getUserById(userId);

    if (user.organizationId) {
      throw new BadRequestException(
        'This is already a member or owner of a organization',
      );
    }

    // create organization and return result
    const newOrganization = await this.prisma.organization.create({
      data: {
        name: dto.name,
        description: dto.description,
        address: {
          connect: { id: dto.addressId },
        },
        owner: {
          connect: {
            id: userId,
          },
        },
      },
    });

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        organizationId: newOrganization.id,
      },
    });

    return newOrganization;
  }
}
