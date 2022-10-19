import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

const tokens = {
  accessToken: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2YjYwNDQwNC1hODU1LTQwYzctODhkMS0yMzdhZjg2OGUyODEiLCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE2NjU0ODQ2NzMsImV4cCI6MTY2NTQ4NTU3M30.jikes68T3QHXNgnamXu-oKBfWYmBJWO_xcyVV1_w94Y`,
  refreshToken: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2YjYwNDQwNC1hODU1LTQwYzctODhkMS0yMzdhZjg2OGUyODEiLCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE2NjU0ODQ2NTYsImV4cCI6MTY2NjA4OTQ1Nn0.ZRX8WD5LrtZPk-TFAlaxh89hIE7RZzbjWaIjIfKhzHY`,
};

describe('Auth controller', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      // If you've looked at the complex sample you'll notice that these functions
      // are a little bit more in depth using mock implementation
      // to give us a little bit more control and flexibility in our tests
      // this is not necessary, but can sometimes be helpful in a test scenario
      providers: [
        {
          provide: AuthService,
          useValue: {
            signupLocal: jest
              .fn()
              .mockImplementation(() => Promise.resolve(tokens)),
            signinLocal: jest
              .fn()
              .mockImplementation(() => Promise.resolve(tokens)),
            signout: jest.fn().mockImplementation(() => {
              return;
            }),
            refreshTokens: jest
              .fn()
              .mockImplementation(() => Promise.resolve(tokens)),
            getTokens: jest
              .fn()
              .mockImplementation(() => Promise.resolve(tokens)),
            updateRtHash: jest.fn().mockImplementation(() => {
              return;
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
