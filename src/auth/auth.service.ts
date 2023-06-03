import {
  BadRequestException,
  CACHE_MANAGER,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OraganizationRole } from '@prisma/client';
import { Cache } from 'cache-manager';
import * as argon2 from 'argon2';
import {
  AT_EXPIRATION,
  AT_SECRET,
  RT_EXPIRATION,
  RT_SECRET,
} from 'src/common/constants';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 } from 'uuid';
import { SignInDto, SignUpDto, Tokens } from './dtos';
import { FORGET_PASSWORD_PREFIX } from 'src/common/constants/redis-constants';
import { sendEmail } from 'src/common/helpers/send-email';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async signupLocal(dto: SignUpDto): Promise<Tokens> {
    const passwordHash = await argon2.hash(dto.password);

    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
      },
    });

    const tokens = await this.getTokens(newUser.id, newUser.email, null, []);

    await this.updateRtHash(newUser.id, tokens.refreshToken);

    return tokens;
  }

  async signinLocal(dto: SignInDto): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new ForbiddenException('User does not exists');
    }

    const passwordsMatch = await argon2.verify(user.passwordHash, dto.password);
    if (!passwordsMatch) {
      throw new ForbiddenException('Invalid password');
    }

    const tokens = await this.getTokens(
      user.id,
      user.email,
      user.organizationId,
      user.roles,
    );
    await this.updateRtHash(user.id, tokens.refreshToken);

    return tokens;
  }

  async signout(userId: string) {
    await this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRT: {
          not: null,
        },
      },
      data: {
        hashedRT: null,
      },
    });
  }

  async generateChangePasswordToken(email: string) {
    const user = await this.prisma.user.findFirst({ where: { email } });
    if (!user) {
      throw new NotFoundException('User with this email is not registered');
    }

    const token = v4();
    await this.cacheService.set(
      FORGET_PASSWORD_PREFIX + token,
      user.id,
      60 * 60 * 24 * 7,
    );

    await sendEmail(
      email,
      `<p>Click <a href=http://localhost:5173/change-password/${token}>here</a> to change your password.</p>`,
    );

    return true;
  }

  async changePassword(token: string, newPassword: string) {
    const key = FORGET_PASSWORD_PREFIX + token;
    const userId = await this.cacheService.get(key);
    if (!userId) {
      throw new BadRequestException('Your token has expired!');
    }

    const user = await this.prisma.user.findFirst({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User no longer exists!');
    }

    const hashedPassword = await argon2.hash(newPassword);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: hashedPassword },
    });
    await this.cacheService.del(key);
    return true;
  }

  async refreshTokens(userId: string, rt: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new ForbiddenException('User does not exists');
    }

    if (!user.hashedRT) {
      throw new ForbiddenException('You are logged out');
    }

    const rtMatches = argon2.verify(user.hashedRT, rt);
    if (!rtMatches) {
      throw new ForbiddenException('Invalid refresh token');
    }

    const tokens = await this.getTokens(
      user.id,
      user.email,
      user.organizationId,
      user.roles,
    );
    await this.updateRtHash(user.id, tokens.refreshToken);

    return tokens;
  }

  // Utility Functions

  async getTokens(
    userId: string,
    email: string,
    organizationId: string,
    roles: OraganizationRole[],
  ): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwt.signAsync(
        { sub: userId, email, roles, organizationId },
        {
          secret: AT_SECRET,
          expiresIn: AT_EXPIRATION,
        },
      ),
      this.jwt.signAsync(
        { sub: userId, email },
        {
          secret: RT_SECRET,
          expiresIn: RT_EXPIRATION,
        },
      ),
    ]);

    return {
      accessToken: at,
      refreshToken: rt,
    };
  }

  async updateRtHash(userId: string, refreshToken: string) {
    const hash = await argon2.hash(refreshToken);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRT: hash,
      },
    });
  }
}
