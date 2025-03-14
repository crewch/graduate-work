import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { hash } from 'argon2';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    createUserDto.password_hash = await hash(createUserDto.password_hash);

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
        user_id: id,
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
        user_id: id,
      },
      data: updateUserDto,
    });
  }

  async remove(id: string) {
    const deletedUser = await this.prismaService.user.delete({
      where: { user_id: id },
    });

    if (!deletedUser) {
      throw new NotFoundException('Пользователь не найден');
    }

    return deletedUser;
  }

  async updateRating(userId: string, newRating: number) {
    return this.prismaService.user.update({
      where: { user_id: userId },
      data: { rating: newRating },
    });
  }

  async getCreatedContests(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { user_id: userId },
      include: { createdContests: true },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user.createdContests;
  }

  async getCreatedProblems(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { user_id: userId },
      include: { createdProblems: true },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user.createdProblems;
  }
}
