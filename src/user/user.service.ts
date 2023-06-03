import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateUserDetailsDto,
  UpdateUserDetailsDto,
  UserDetailsDto,
} from './dtos';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserDetails(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const userDetails = await this.prisma.userDetails.findUnique({
      where: { userId },
      select: {
        firstName: true,
        lastName: true,
        phoneNumber: true,
        about: true,
      },
    });

    let organizationName = null;
    if (user.organizationId !== null) {
      const organization = await this.prisma.organization.findUnique({
        where: { id: user.organizationId },
      });
      organizationName = organization.name;
    }

    return { organizationName, ...userDetails };
  }

  async getUserInvites(userId: string) {
    const invites = await this.prisma.organizationInvite.findMany({
      where: {
        userId,
      },
    });

    return invites;
  }

  async getUserById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        organizationId: true,
        roles: true,
        userDetails: {
          select: {
            firstName: true,
            lastName: true,
            about: true,
            phoneNumber: true,
          },
        },
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
      select: {
        id: true,
        email: true,
        roles: true,
        userDetails: true,
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

  async createUserDetails(dto: CreateUserDetailsDto, userId: string) {
    const { firstName, lastName, about, phoneNumber } = dto;
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

  async updateUserDetails(dto: UpdateUserDetailsDto, userId: string) {
    const { firstName, lastName, about, phoneNumber } = dto;
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
