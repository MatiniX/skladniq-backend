import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Organization } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { CreateOrganizationDto, UpdateOrganizationDto } from './dtos';

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
        },
      },
      include: {
        members: true,
      },
    });

    return updatedOrganization.members;
  }

  async removeMember(organizationId: string, memberId: string) {
    const updatedMembers = await this.prisma.organization.update({
      where: {
        id: organizationId,
      },
      data: {
        members: {
          disconnect: {
            id: memberId,
          },
        },
      },
      select: {
        members: true,
      },
    });

    return updatedMembers;
  }
}
