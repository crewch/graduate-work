import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verify } from 'argon2';
import { CookieOptions, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from './dto/sign-in';
import { SignUpDto } from './dto/sign-up.dto';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  readonly REFRESH_TOKEN_NAME = 'refreshToken';
  private readonly EXPIRE_DAYS_REFRESH_TOKEN = 7;
  private readonly DAY = 24 * 60 * 60;
  private readonly IS_PRODUCTION = process.env.NODE_ENV === 'production';
  private readonly COOKIE_OPTIONS: CookieOptions = {
    httpOnly: true,
    secure: false, // todo настроить когда будет https `this.IS_PRODUCTION`
    sameSite: this.IS_PRODUCTION ? 'lax' : 'none',
    domain: this.IS_PRODUCTION ? process.env.DOMAIN_PROD : 'localhost',
  };

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRedis() private readonly redisService: Redis,
  ) {}

  async signIn(signInDto: SignInDto) {
    const user = await this.usersService.findByLogin(signInDto.login);

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    const isValidPassword = await verify(user.passwordHash, signInDto.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Неверный пароль');
    }

    const tokens = await this.issueTokens(user.userId);

    return { user: plainToInstance(UserEntity, user), ...tokens };
  }

  async signUp(signUpDto: SignUpDto) {
    const { username, email, password } = signUpDto;

    const existingUserEmail = await this.usersService.findByLogin(email);

    if (existingUserEmail) {
      throw new BadRequestException(
        'Пользователь с таким email уже существует',
      );
    }

    const existingUsername = await this.usersService.findByLogin(username);

    if (existingUsername) {
      throw new BadRequestException(
        'Пользователь с таким username уже существует',
      );
    }

    const user = await this.usersService.create({
      username,
      email,
      passwordHash: password,
    });

    const tokens = await this.issueTokens(user.userId);

    return { user: plainToInstance(UserEntity, user), ...tokens };
  }

  async getNewTokens(refreshToken: string) {
    const result = await this.jwtService.verifyAsync<{ sub: string }>(
      refreshToken,
    );

    if (!result) {
      throw new UnauthorizedException('Refresh токен устарел');
    }

    const userId = await this.getToken(refreshToken);

    if (!userId || userId !== result.sub) {
      throw new UnauthorizedException('Невалидный refresh токен');
    }

    await this.deleteToken(refreshToken);

    const user = await this.usersService.findById(result.sub);

    const tokens = await this.issueTokens(result.sub);

    return { user: plainToInstance(UserEntity, user), ...tokens };
  }

  private async issueTokens(userId: string) {
    const payload = { sub: userId };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });

    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    await this.addToken(
      refreshToken,
      userId,
      this.EXPIRE_DAYS_REFRESH_TOKEN * this.DAY,
    );

    return { accessToken, refreshToken };
  }

  addRefreshTokenToResponse(res: Response, refreshToken: string) {
    const expiresIn = new Date();

    expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAYS_REFRESH_TOKEN);

    res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      ...this.COOKIE_OPTIONS,
      expires: expiresIn,
    });
  }

  removeRefreshTokenFromResponse(res: Response) {
    res.clearCookie(this.REFRESH_TOKEN_NAME, this.COOKIE_OPTIONS);
  }

  async addToken(token: string, userId: string, ttl: number) {
    await this.redisService.set(`token:${token}`, userId, 'EX', ttl);
  }

  async getToken(token: string) {
    return this.redisService.get(`token:${token}`);
  }

  async deleteToken(token: string) {
    await this.redisService.del(`token:${token}`);
  }
}
