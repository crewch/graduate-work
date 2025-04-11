import { Injectable } from '@nestjs/common';
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

  findById(userId: string) {
    return this.prismaService.user.findUnique({
      where: {
        userId,
      },
    });
  }

  findByLogin(login: string) {
    return this.prismaService.user.findFirst({
      where: {
        OR: [{ username: login }, { email: login }],
      },
    });
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
    return this.prismaService.user.delete({
      where: { userId },
    });
  }

  async getGlobalRatings(page: number = 1, pageSize: number = 10) {
    const [contests, total] = await this.prismaService.$transaction([
      this.prismaService.user.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          username: true,
          rating: true,
        },
        orderBy: {
          rating: 'desc',
        },
      }),
      this.prismaService.contest.count(),
    ]);

    return { contests, total };
  }
}
