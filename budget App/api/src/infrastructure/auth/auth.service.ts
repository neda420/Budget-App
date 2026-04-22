import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';
import type { RegisterDto } from '../../interface-adapters/rest/auth/dto/register.dto';
import type { LoginDto } from '../../interface-adapters/rest/auth/dto/login.dto';

export interface JwtPayload {
  sub: string;
  email: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  refreshExpiresIn: number;
}

const SALT_ROUNDS = 12;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<{ id: string }> {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      select: { id: true },
    });
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        name: dto.name,
        passwordHash,
      },
      select: { id: true },
    });

    return { id: user.id };
  }

  async login(dto: LoginDto): Promise<AuthTokens> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.issueTokens(user.id, user.email);
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    const session = await this.prisma.session.findUnique({
      where: { token: refreshToken },
      select: { id: true, userId: true, expiresAt: true },
    });
    if (!session) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (session.expiresAt.getTime() <= Date.now()) {
      await this.prisma.session.delete({ where: { id: session.id } });
      throw new UnauthorizedException('Refresh token expired');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, email: true },
    });
    if (!user) {
      await this.prisma.session.delete({ where: { id: session.id } });
      throw new UnauthorizedException('User not found');
    }

    const nextRefreshToken = randomBytes(64).toString('hex');
    await this.prisma.session.update({
      where: { id: session.id },
      data: {
        token: nextRefreshToken,
        expiresAt: new Date(Date.now() + this.getRefreshExpiresIn() * 1000),
      },
    });

    const payload: JwtPayload = { sub: user.id, email: user.email };
    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.getJwtSecret(),
      expiresIn: this.getAccessExpiresIn(),
    });

    return {
      accessToken,
      refreshToken: nextRefreshToken,
      tokenType: 'Bearer',
      expiresIn: this.getAccessExpiresIn(),
      refreshExpiresIn: this.getRefreshExpiresIn(),
    };
  }

  async validateUser(
    userId: string,
  ): Promise<{ id: string; email: string } | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });
    return user;
  }

  private async issueTokens(
    userId: string,
    email: string,
  ): Promise<AuthTokens> {
    const payload: JwtPayload = { sub: userId, email };
    const accessExpiresIn = this.getAccessExpiresIn();
    const refreshExpiresIn = this.getRefreshExpiresIn();

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: this.getJwtSecret(),
        expiresIn: accessExpiresIn,
      }),
      Promise.resolve(randomBytes(64).toString('hex')),
    ]);

    await this.prisma.session.create({
      data: {
        userId,
        token: refreshToken,
        expiresAt: new Date(Date.now() + refreshExpiresIn * 1000),
      },
    });

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: accessExpiresIn,
      refreshExpiresIn,
    };
  }

  private getJwtSecret(): string {
    const secret = this.config.get<string>('JWT_SECRET');
    if (!secret) {
      throw new InternalServerErrorException('JWT_SECRET is not configured');
    }
    return secret;
  }

  private getAccessExpiresIn(): number {
    const ttl = Number(this.config.get<string>('JWT_EXPIRES_IN') ?? 3600);
    return Number.isFinite(ttl) && ttl > 0 ? ttl : 3600;
  }

  private getRefreshExpiresIn(): number {
    const ttl = Number(
      this.config.get<string>('JWT_REFRESH_EXPIRES_IN') ?? 60 * 60 * 24 * 30,
    );
    return Number.isFinite(ttl) && ttl > 0 ? ttl : 60 * 60 * 24 * 30;
  }
}
