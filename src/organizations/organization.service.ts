import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Organization } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import {
  AddRoleDto,
  CreateOrganizationDto,
  CreateWarehousePermissionDto,
  RemoveRoleDto,
  RemoveWarehousePermissionDto,
  UpdateOrganizationDto,
  UpdateWarehousePermissionDto,
} from './dtos';

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
        roles: { set: 'owner' },
      },
    });

    return newOrganization;
  }

  async updateOrganization(dto: UpdateOrganizationDto) {
    let updatedOrganization: Organization;

    try {
      updatedOrganization = await this.prisma.organization.update({
        where: {
          id: dto.organizationId,
        },
        data: {
          name: dto.name,
          description: dto.description,
        },
      });
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Organization does not exists');
    }

    return updatedOrganization;
  }

  async closeOrganization(organizationId: string) {
    try {
      await this.prisma.organization.update({
        where: {
          id: organizationId,
        },
        data: {
          active: false,
        },
      });
    } catch (error) {
      throw new NotFoundException('Organization was not found');
    }

    return true;
  }

  async addMember(organizationId: string, memberId: string) {
    const organization = await this.prisma.organization.findUnique({
      where: {
        id: organizationId,
      },
    });

    if (!organization) {
      throw new NotFoundException('Organization does not exists');
    }

    const member = await this.prisma.user.findUnique({
      where: {
        id: memberId,
      },
    });

    if (!member) {
      throw new NotFoundException('User not found');
    } else if (member.organizationId !== null) {
      throw new BadRequestException(
        'This user is already a member of organization',
      );
    }

    const updatedOrganization = await this.prisma.organization.update({
      where: {
        id: organizationId,
      },
      data: {
        members: {
          connect: {
            id: memberId,
          },
          update: {
            where: { id: memberId },
            data: {
              roles: {
                set: 'employee',
              },
            },
          },
        },
      },
      include: {
        members: {
          select: {
            id: true,
            roles: true,
            email: true,
            userDetails: true,
          },
        },
      },
    });

    return updatedOrganization.members;
  }

  async addRole(dto: AddRoleDto) {
    try {
      const user = this.prisma.user.update({
        where: {
          id: dto.userId,
        },
        data: {
          roles: {
            push: dto.role,
          },
        },
        select: {
          id: true,
          roles: true,
          email: true,
          organizationId: true,
        },
      });

      return user;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async removeRole(dto: RemoveRoleDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: dto.userId,
        },
      });

      const updatedRoles = user.roles.filter((r) => r !== dto.role);

      await this.prisma.user.update({
        where: {
          id: dto.userId,
        },
        data: {
          roles: updatedRoles,
        },
      });

      return true;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async removeMember(organizationId: string, memberId: string) {
    const updatedMembers = await this.prisma.organization.update({
      where: {
        id: organizationId,
      },
      data: {
        members: {
          update: {
            where: { id: memberId },
            data: { roles: { set: [] } },
          },
          disconnect: {
            id: memberId,
          },
        },
      },
      select: {
        members: {
          select: {
            id: true,
            roles: true,
            email: true,
            userDetails: true,
          },
        },
      },
    });

    return updatedMembers;
  }

  async createWarehousePermission(dto: CreateWarehousePermissionDto) {
    try {
      const newPermission = await this.prisma.warehousePermission.create({
        data: {
          warehouse: {
            connect: {
              id: dto.warehouseId,
            },
          },
          user: {
            connect: {
              id: dto.userId,
            },
          },
          permission: dto.permission,
        },
      });

      return newPermission;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateWarehousePermission(dto: UpdateWarehousePermissionDto) {
    try {
      const updatedPermission = await this.prisma.warehousePermission.update({
        where: {
          warehouseId_userId: {
            userId: dto.userId,
            warehouseId: dto.warehouseId,
          },
        },
        data: {
          permission: dto.permission,
        },
      });

      return updatedPermission;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async removeWarehousePermission(dto: RemoveWarehousePermissionDto) {
    try {
      await this.prisma.warehousePermission.delete({
        where: {
          warehouseId_userId: {
            userId: dto.userId,
            warehouseId: dto.warehouseId,
          },
        },
      });

      return true;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
