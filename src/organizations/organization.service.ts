import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
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
import { sendEmail } from 'src/common/helpers/send-email';
import { SetRolesDto } from './dtos/set-roles.dto';

@Injectable()
export class OrganizationService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async getOrganizationById(id: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { id },
    });

    if (!organization) {
      throw new NotFoundException('Organization does not exist');
    }

    return organization;
  }

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
          create: {
            city: dto.city,
            country: dto.country,
            postcode: dto.postcode,
            region: dto.region,
            streetAddress: dto.streetAddress,
          },
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

  async addMember(memberId: string, organizationId: string) {
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

    await this.prisma.organizationInvite.delete({
      where: { userId_organizationId: { userId: memberId, organizationId } },
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

  async setRoles(dto: SetRolesDto) {
    try {
      const user = await this.prisma.user.update({
        where: {
          id: dto.userId,
        },
        data: {
          roles: {
            set: dto.roles,
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

  async sendInvitationEmail(email: string, orgId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new NotFoundException("User doesn't exists");
    }

    const invite = await this.prisma.organizationInvite.create({
      data: { userId: user.id, organizationId: orgId },
    });

    return invite;
  }
}
