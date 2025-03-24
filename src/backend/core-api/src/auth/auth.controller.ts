import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @ApiOperation({ summary: 'Авторизация пользователя' })
  @ApiCreatedResponse({
    description: 'Успешная авторизация',
    type: AuthResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Неверные учетные данные',
  })
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
  @ApiCreatedResponse({
    description: 'Пользователь успешно зарегистрирован',
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Пользователь уже существует',
  })
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
  @ApiCreatedResponse({
    description: 'Токены успешно обновлены',
    type: AuthResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Невалидный refresh токен' })
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
  @HttpCode(204)
  @ApiOperation({ summary: 'Выход из системы' })
  @ApiNoContentResponse({ description: 'Успешный выход' })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.authService.removeRefreshTokenFromStorage(req.cookies);

    this.authService.removeRefreshTokenFromResponse(res);
  }
}
