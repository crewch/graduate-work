import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { UserResponseDto } from './dto/user-response.dto';

@Auth()
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Создать нового пользователя' })
  @ApiCreatedResponse({ type: UserResponseDto })
  async create(@Body() dto: CreateUserDto) {
    const user = await this.usersService.create(dto);

    return new UserResponseDto(user);
  }

  @Get()
  @ApiOperation({ summary: 'Получить всех пользователей' })
  @ApiOkResponse({ type: [UserResponseDto] })
  async findAll() {
    const users = await this.usersService.findAll();

    return users.map((user) => new UserResponseDto(user));
  }

  @Get('profile')
  @ApiOperation({ summary: 'Получить текущего пользователя' })
  @ApiOkResponse({ type: UserResponseDto })
  getProfile(@CurrentUser() user: User) {
    return new UserResponseDto(user);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Обновить данные текущего пользователя' })
  @ApiOkResponse({ type: UserResponseDto })
  async updateProfile(
    @CurrentUser('userId') userId: string,
    @Body() dto: UpdateUserDto,
  ) {
    const user = await this.usersService.update(userId, dto);

    return new UserResponseDto(user);
  }

  @Delete('profile')
  @HttpCode(204)
  @ApiOperation({ summary: 'Удалить текущего пользователя' })
  @ApiNoContentResponse()
  async removeProfile(@CurrentUser('userId') userId: string) {
    await this.usersService.remove(userId);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Получить пользователя по ID' })
  @ApiOkResponse({ type: UserResponseDto })
  async findOne(@Param('userId') userId: string) {
    const user = await this.usersService.findById(userId);

    return new UserResponseDto(user);
  }

  @Patch(':userId')
  @ApiOperation({ summary: 'Обновить данные пользователя по ID' })
  @ApiOkResponse({ type: UserResponseDto })
  async update(@Param('userId') userId: string, @Body() dto: UpdateUserDto) {
    const user = await this.usersService.update(userId, dto);

    return new UserResponseDto(user);
  }

  @Delete(':userId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Удалить пользователя по ID' })
  @ApiNoContentResponse()
  async remove(@Param('userId') userId: string) {
    await this.usersService.remove(userId);
  }
}
