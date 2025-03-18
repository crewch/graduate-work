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
import { UserEntity } from './entities/user.entity';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';

@Auth()
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Создать нового пользователя' })
  @ApiResponse({ status: 201, type: UserEntity })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);

    return new UserEntity(user);
  }

  @Get()
  @ApiOperation({ summary: 'Получить всех пользователей' })
  @ApiResponse({ status: 200, type: [UserEntity] })
  async findAll() {
    const users = await this.usersService.findAll();

    return users.map((user) => new UserEntity(user));
  }

  @Get('profile')
  @ApiOperation({ summary: 'Получить текущего пользователя' })
  @ApiResponse({ status: 200, type: UserEntity })
  getProfile(@CurrentUser() user: User) {
    return new UserEntity(user);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Получить пользователя по ID' })
  @ApiResponse({ status: 200, type: UserEntity })
  async findOne(@Param('userId') userId: string) {
    const user = await this.usersService.findById(userId);

    return new UserEntity(user);
  }

  @Patch(':userId')
  @ApiOperation({ summary: 'Обновить данные пользователя' })
  @ApiResponse({ status: 200, type: UserEntity })
  async update(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.update(userId, updateUserDto);

    return new UserEntity(user);
  }

  @Delete(':userId')
  @ApiOperation({ summary: 'Удалить пользователя' })
  @ApiResponse({ status: 200, type: UserEntity })
  remove(@Param('userId') userId: string) {
    return this.usersService.remove(userId);
  }

  @Get(':userId/contests')
  @ApiOperation({ summary: 'Получить созданные контесты' })
  getCreatedContests(@Param('userId') userId: string) {
    return this.usersService.getCreatedContests(userId);
  }

  @Get(':userId/problems')
  @ApiOperation({ summary: 'Получить созданные задачи' })
  async getCreatedProblems(@Param('userId') userId: string) {
    return this.usersService.getCreatedProblems(userId);
  }
}
