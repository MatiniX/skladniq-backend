import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { useContainer } from 'class-validator';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from 'src/auth/dtos';
import { SignInDto } from 'src/auth/dtos/signin.dto';
import * as cookieParser from 'cookie-parser';

const signUpDto: SignUpDto = { email: 'test@e2e.com', password: 'passw0rd' };
const signInDto: SignInDto = { email: 'test@e2e.com', password: 'passw0rd' };
let refreshToken: string;
let accessToken: string;
const tokensShape = expect.objectContaining({
  accessToken: expect.any(String),
  refreshToken: expect.any(String),
});

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);

    app.use(cookieParser());
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('POST /local/signup', () => {
    it('should sign up a new user', async () => {
      const beforeCount = await prisma.user.count();

      const { body, status } = await request(app.getHttpServer())
        .post('/auth/local/signup')
        .send(signUpDto);

      const afterCount = await prisma.user.count();

      expect(status).toBe(201);
      expect(body).toEqual(tokensShape);
      expect(afterCount - beforeCount).toBe(1);
    });
  });

  describe('POST /local/signin', () => {
    it('should sign in existing user', async () => {
      const userCount = await prisma.user.count();

      const { body, status } = await request(app.getHttpServer())
        .post('/auth/local/signin')
        .send(signInDto);

      expect(status).toBe(200);
      expect(body).toEqual(tokensShape);
      expect(userCount).toBe(1);
      refreshToken = body.refreshToken;
    });

    describe('sign in with invalid credentials', () => {
      it('should return 403 forbidden', async () => {
        const userCount = await prisma.user.count();

        const { status } = await request(app.getHttpServer())
          .post('/auth/local/signin')
          .send({ email: signInDto.email, password: 'wrongone' });

        expect(status).toBe(403);
        expect(userCount).toBe(1);
      });
    });
  });

  describe('POST /refresh', () => {
    it('should issue a new pair of tokens', async () => {
      const userCount = await prisma.user.count();

      const { body, status } = await request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Cookie', 'rt=' + refreshToken)
        .send();

      expect(status).toBe(200);
      expect(body).toEqual(tokensShape);
      expect(userCount).toBe(1);
      accessToken = body.accessToken;
    });
  });

  describe('POST /signout', () => {
    it('should sign out the current user', async () => {
      const userCount = await prisma.user.count();

      const { status } = await request(app.getHttpServer())
        .post('/auth/signout')
        .set('Authorization', 'Bearer ' + accessToken)
        .send();

      expect(status).toBe(200);
      expect(userCount).toBe(1);
    });
  });
});
