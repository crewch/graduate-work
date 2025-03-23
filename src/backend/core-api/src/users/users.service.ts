import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { hash } from 'argon2';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    createUserDto.passwordHash = await hash(createUserDto.passwordHash);

    return this.prismaService.user.create({
      data: createUserDto,
    });
  }

  findAll() {
    return this.prismaService.user.findMany();
  }

  async findById(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        userId,
      },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  async findByLogin(login: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [{ username: login }, { email: login }],
      },
    });

    return user;
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.passwordHash) {
      updateUserDto.passwordHash = await hash(updateUserDto.passwordHash);
    }

    return this.prismaService.user.update({
      where: {
        userId,
      },
      data: updateUserDto,
    });
  }

  async remove(userId: string) {
    const deletedUser = await this.prismaService.user.delete({
      where: { userId },
    });

    if (!deletedUser) {
      throw new NotFoundException('Пользователь не найден');
    }

    return deletedUser;
  }
}
