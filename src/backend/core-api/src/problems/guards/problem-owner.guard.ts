import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ProblemOwnerGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as User;
    const problemId = request.params.problemId;

    const problem = await this.prisma.problem.findUnique({
      where: { problemId },
    });

    if (!problem) {
      throw new NotFoundException('Задача не найдена');
    }

    return problem.createdBy === user.userId;
  }
}
