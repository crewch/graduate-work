import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ContestOwnerGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as User;
    const contestId = request.params.contestId;

    const contest = await this.prisma.contest.findUnique({
      where: { contestId },
    });

    if (!contest) {
      throw new NotFoundException('Контест не найден');
    }

    return contest.createdBy === user.userId;
  }
}
