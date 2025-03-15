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

  async findById(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        userId: id,
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

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.prismaService.user.update({
      where: {
        userId: id,
      },
      data: updateUserDto,
    });
  }

  async remove(id: string) {
    const deletedUser = await this.prismaService.user.delete({
      where: { userId: id },
    });

    if (!deletedUser) {
      throw new NotFoundException('Пользователь не найден');
    }

    return deletedUser;
  }

  async updateRating(userId: string, newRating: number) {
    return this.prismaService.user.update({
      where: { userId: userId },
      data: { rating: newRating },
    });
  }

  async getCreatedContests(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { userId: userId },
      include: { createdContests: true },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user.createdContests;
  }

  async getCreatedProblems(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { userId: userId },
      include: { createdProblems: true },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user.createdProblems;
  }
}
