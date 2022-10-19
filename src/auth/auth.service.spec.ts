import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

const testEmail = 'mail@test.com';
const testPassword = uuidv4();
const testRtHash = uuidv4();
const userId = uuidv4();

const userArray: User[] = [
  {
    id: userId,
    email: testEmail,
    passwordHash: testPassword,
    hashedRT: testRtHash,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const oneUser = userArray[0];

const tokens = {
  accessToken: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2YjYwNDQwNC1hODU1LTQwYzctODhkMS0yMzdhZjg2OGUyODEiLCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE2NjU0ODQ2NzMsImV4cCI6MTY2NTQ4NTU3M30.jikes68T3QHXNgnamXu-oKBfWYmBJWO_xcyVV1_w94Y`,
  refreshToken: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2YjYwNDQwNC1hODU1LTQwYzctODhkMS0yMzdhZjg2OGUyODEiLCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE2NjU0ODQ2NTYsImV4cCI6MTY2NjA4OTQ1Nn0.ZRX8WD5LrtZPk-TFAlaxh89hIE7RZzbjWaIjIfKhzHY`,
};

const db = {
  user: {
    create: jest.fn().mockReturnValue(oneUser),
    update: jest.fn().mockReturnValue(oneUser),
  },
};
const jwt = {
  sign: {},
};

describe('CatService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: db,
        },
        {
          provide: JwtService,
          useValue: jwt,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });
  describe('getTokens', () => {
    it('should return access and refresh tokens', async () => {
      jest.spyOn(service, 'getTokens').mockImplementation(async () => tokens);

      expect(await service.getTokens(oneUser.id, oneUser.hashedRT)).toBe(
        tokens,
      );
    });
  });

  describe('updateRtHash', () => {
    it('should update refresh token hash', async () => {
      jest
        .spyOn(service, 'updateRtHash')
        .mockImplementation(async (): Promise<void> => {
          return;
        });
      await service.updateRtHash(oneUser.id, tokens.refreshToken);

      expect(service.updateRtHash).toBeCalled();
      expect(oneUser.hashedRT).toBe(testRtHash);
    });
  });
});
