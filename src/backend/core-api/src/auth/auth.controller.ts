import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthEntity } from './entities/auth.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @ApiOperation({ summary: 'Авторизация пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Успешная авторизация',
    type: AuthEntity,
  })
  @ApiResponse({ status: 401, description: 'Неверные учетные данные' })
  async login(
    @Body() dto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, ...response } = await this.authService.signIn(dto);

    this.authService.addRefreshTokenToResponse(res, refreshToken);

    return response;
  }

  @Post('sign-up')
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно зарегистрирован',
    type: AuthEntity,
  })
  @ApiResponse({ status: 400, description: 'Пользователь уже существует' })
  async register(
    @Body() dto: SignUpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, ...response } = await this.authService.signUp(dto);

    this.authService.addRefreshTokenToResponse(res, refreshToken);

    return response;
  }

  @Post('sign-in/access-token')
  @ApiOperation({ summary: 'Обновление access/refresh токенов' })
  @ApiResponse({
    status: 200,
    description: 'Токены успешно обновлены',
    type: AuthEntity,
  })
  @ApiResponse({ status: 401, description: 'Невалидный refresh токен' })
  async getNewTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshTokenFromCookies = req.cookies[
      this.authService.REFRESH_TOKEN_NAME
    ] as string | undefined;

    if (!refreshTokenFromCookies) {
      this.authService.removeRefreshTokenFromResponse(res);

      throw new UnauthorizedException('Refresh токен не передан');
    }

    const { refreshToken, ...response } = await this.authService.getNewTokens(
      refreshTokenFromCookies,
    );

    this.authService.addRefreshTokenToResponse(res, refreshToken);

    return response;
  }

  @Post('sign-out')
  @ApiOperation({ summary: 'Выход из системы' })
  @ApiResponse({ status: 200, description: 'Успешный выход' })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshTokenFromCookies = req.cookies[
      this.authService.REFRESH_TOKEN_NAME
    ] as string | undefined;

    if (refreshTokenFromCookies) {
      await this.authService.deleteToken(refreshTokenFromCookies);
    }

    this.authService.removeRefreshTokenFromResponse(res);

    return true;
  }
}
