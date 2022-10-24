import { Test, TestingModule } from '@nestjs/testing';
import { Organization } from '@prisma/client';
import { OrganizationService } from './organization.service';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrganizationDto } from './dtos';
import { UserService } from 'src/user/user.service';

const testOrganization: Organization = {
  id: uuidv4(),
  active: true,
  addressId: uuidv4(),
  createdAt: new Date(),
  updatedAt: new Date(),
  description: 'A test desrciption',
  name: 'Test Inc.',
  ownerId: uuidv4(),
};

const prismaMock = {
  organization: {
    findUnique: jest.fn().mockResolvedValue(testOrganization),
    create: jest.fn().mockReturnValue(testOrganization),
    save: jest.fn(),
    update: jest.fn().mockResolvedValue(testOrganization),
  },

  user: {
    update: jest.fn(),
  },
};
const userServiceMock = {
  getUserById: jest.fn().mockResolvedValue({ organizationId: null }),
};

describe('OrganizationService', () => {
  let service: OrganizationService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: UserService, useValue: userServiceMock },
      ],
    }).compile();

    service = module.get<OrganizationService>(OrganizationService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Create organization', () => {
    it('should create an organization', async () => {
      const userId = uuidv4();
      const dto: CreateOrganizationDto = {
        name: testOrganization.name,
        addressId: testOrganization.addressId,
        description: testOrganization.description,
      };

      expect(service.createOrganization(userId, dto)).resolves.toEqual(
        testOrganization,
      );
    });
  });

  describe('Update organization', () => {
    it('should update an existing organization', async () => {
      const updatedOrganization = await service.updateOrganization({
        description: testOrganization.description,
        name: testOrganization.name,
        organizationId: testOrganization.id,
      });

      expect(updatedOrganization).toEqual(testOrganization);
    });
  });
});
