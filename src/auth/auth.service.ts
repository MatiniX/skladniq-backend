import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInDto, SignUpDto, Tokens } from './dtos';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async signupLocal(dto: SignUpDto): Promise<Tokens> {
    const passwordHash = await argon2.hash(dto.password);

    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
      },
    });

    const tokens = await this.getTokens(newUser.id, newUser.email);

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

    const tokens = await this.getTokens(user.id, user.email);
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

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refreshToken);

    return tokens;
  }

  // Utility Functions

  async getTokens(userId: string, email: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwt.signAsync(
        { sub: userId, email: email },
        {
          secret: 'at-secret',
          expiresIn: 60 * 15,
        },
      ),
      this.jwt.signAsync(
        { sub: userId, email: email },
        {
          secret: 'rt-secret',
          expiresIn: '7d',
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
