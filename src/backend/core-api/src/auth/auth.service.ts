import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verify } from 'argon2';
import { Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { UsersService } from 'src/users/users.service';
import { SignInDto } from './dto/sign-in';
import { SignUpDto } from './dto/sign-up.dto';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  readonly REFRESH_TOKEN_NAME = 'refreshToken';
  private readonly EXPIRE_DAY_REFRESH_TOKEN = 1;
  private readonly IS_PRODUCTION = process.env.NODE_ENV === 'production';
  private readonly DOMAIN = this.IS_PRODUCTION
    ? process.env.DOMAIN_PROD
    : 'localhost';

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const user = await this.usersService.findByLogin(signInDto.login);

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    const isValidPassword = await verify(
      user.password_hash,
      signInDto.password_hash,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Неверный пароль');
    }

    const tokens = this.issueTokens(user.user_id);

    return { user: plainToInstance(UserEntity, user), ...tokens };
  }

  async signUp(signUpDto: SignUpDto) {
    const existingUser = await this.usersService.findByLogin(signUpDto.email);

    if (existingUser) {
      throw new BadRequestException(
        'Пользователь с таким логином уже существует',
      );
    }

    const user = await this.usersService.create(signUpDto);

    const tokens = this.issueTokens(user.user_id);

    return { user: plainToInstance(UserEntity, user), ...tokens };
  }

  async getNewTokens(refreshToken: string) {
    const result = await this.jwtService.verifyAsync<{ id: string }>(
      refreshToken,
    );

    if (!result) {
      throw new UnauthorizedException('Refresh токен устарел');
    }

    const user = await this.usersService.findById(result.id);

    const tokens = this.issueTokens(result.id);

    return { user: plainToInstance(UserEntity, user), ...tokens };
  }

  private issueTokens(id: string) {
    const payload = { id };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });

    const refreshToken = this.jwtService.sign(payload, { expiresIn: '24h' });

    return { accessToken, refreshToken };
  }

  addRefreshTokenToResponse(res: Response, refreshToken: string) {
    const expiresIn = new Date();

    expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);

    res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      expires: expiresIn,
      domain: this.DOMAIN,
      secure: false, // todo настроить когда будет https
      sameSite: this.IS_PRODUCTION ? 'lax' : 'none',
    });
  }

  removeRefreshTokenFromResponse(res: Response) {
    res.cookie(this.REFRESH_TOKEN_NAME, '', {
      httpOnly: true,
      expires: new Date(0),
      domain: this.DOMAIN,
      secure: false, // todo настроить когда будет https
      sameSite: this.IS_PRODUCTION ? 'lax' : 'none',
    });
  }
}
