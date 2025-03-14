import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';

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

  @Get(':id')
  @ApiOperation({ summary: 'Получить пользователя по ID' })
  @ApiResponse({ status: 200, type: UserEntity })
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findById(id);

    return new UserEntity(user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить данные пользователя' })
  @ApiResponse({ status: 200, type: UserEntity })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.update(id, updateUserDto);

    return new UserEntity(user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить пользователя' })
  @ApiResponse({ status: 200, type: UserEntity })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Get(':id/contests')
  @ApiOperation({ summary: 'Получить созданные контесты' })
  getCreatedContests(@Param('id') id: string) {
    return this.usersService.getCreatedContests(id);
  }

  @Get(':id/problems')
  @ApiOperation({ summary: 'Получить созданные задачи' })
  async getCreatedProblems(@Param('id') id: string) {
    return this.usersService.getCreatedProblems(id);
  }
}
