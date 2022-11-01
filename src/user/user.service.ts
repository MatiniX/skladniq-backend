import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDetailsDto, UpdateUserDetailsDto } from './dtos';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with id: ${userId} does not exists`);
    }

    return user;
  }

  async getUsersByOrganization(organizationId: string) {
    const organizationMembers = await this.prisma.user.findMany({
      where: {
        organizationId,
      },
    });

    if (!organizationMembers.length) {
      throw new NotFoundException(
        'Organization does not exists or worse it has no members!',
      );
    }

    return organizationMembers;
  }

  async getUserWarehousePermissions(userId: string) {
    const permissions = await this.prisma.warehousePermission.findMany({
      where: {
        userId,
      },
    });

    return permissions;
  }

  async createUserDetails(dto: CreateUserDetailsDto) {
    const { firstName, lastName, userId, about, phoneNumber } = dto;
    const userDetails = await this.prisma.userDetails.create({
      data: {
        firstName,
        lastName,
        about,
        phoneNumber,
        user: {
          connect: { id: userId },
        },
      },
    });

    return userDetails;
  }

  async updateUserDetails(dto: UpdateUserDetailsDto) {
    const { firstName, lastName, userId, about, phoneNumber } = dto;
    const updatedUserDetails = await this.prisma.userDetails.update({
      where: {
        userId,
      },
      data: {
        firstName,
        lastName,
        about,
        phoneNumber,
      },
    });

    return updatedUserDetails;
  }
}
