import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { hash } from 'argon2';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(dto: CreateUserDto) {
    dto.passwordHash = await hash(dto.passwordHash);

    return this.prismaService.user.create({
      data: dto,
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

  async update(userId: string, dto: UpdateUserDto) {
    if (dto.passwordHash) {
      dto.passwordHash = await hash(dto.passwordHash);
    }

    return this.prismaService.user.update({
      where: {
        userId,
      },
      data: dto,
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
