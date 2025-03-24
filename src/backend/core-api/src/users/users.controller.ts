import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
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
  @ApiResponse({ status: 201, type: UserResponseDto })
  async create(@Body() dto: CreateUserDto) {
    const user = await this.usersService.create(dto);

    return new UserResponseDto(user);
  }

  @Get()
  @ApiOperation({ summary: 'Получить всех пользователей' })
  @ApiResponse({ status: 200, type: [UserResponseDto] })
  async findAll() {
    const users = await this.usersService.findAll();

    return users.map((user) => new UserResponseDto(user));
  }

  @Get('profile')
  @ApiOperation({ summary: 'Получить текущего пользователя' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  getProfile(@CurrentUser() user: User) {
    return new UserResponseDto(user);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Обновить данные текущего пользователя' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  async updateProfile(
    @CurrentUser('userId') userId: string,
    @Body() dto: UpdateUserDto,
  ) {
    const user = await this.usersService.update(userId, dto);

    return new UserResponseDto(user);
  }

  @Delete('profile')
  @ApiOperation({ summary: 'Удалить текущего пользователя' })
  @ApiResponse({ status: 204 })
  async removeProfile(@CurrentUser('userId') userId: string) {
    await this.usersService.remove(userId);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Получить пользователя по ID' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  async findOne(@Param('userId') userId: string) {
    const user = await this.usersService.findById(userId);

    return new UserResponseDto(user);
  }

  @Patch(':userId')
  @ApiOperation({ summary: 'Обновить данные пользователя по ID' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  async update(@Param('userId') userId: string, @Body() dto: UpdateUserDto) {
    const user = await this.usersService.update(userId, dto);

    return new UserResponseDto(user);
  }

  @Delete(':userId')
  @ApiOperation({ summary: 'Удалить пользователя по ID' })
  @ApiResponse({ status: 204 })
  async remove(@Param('userId') userId: string) {
    await this.usersService.remove(userId);
  }
}
