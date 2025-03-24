import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProblemDto } from './dto/create-problem.dto';
import { UpdateProblemDto } from './dto/update-problem.dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ProblemsService {
  constructor(private readonly prismaService: PrismaService) {}

  create(userId: string, dto: CreateProblemDto) {
    return this.prismaService.problem.create({
      data: {
        title: dto.title,
        description: dto.description,
        inputFormat: dto.inputFormat,
        outputFormat: dto.outputFormat,
        timeLimit: dto.timeLimit,
        memoryLimit: dto.memoryLimit,
        createdBy: userId,
        samples: {
          create: dto.samples.map((sample) => ({
            input: sample.input,
            output: sample.output,
            explanation: sample.explanation,
          })),
        },
        testCases: {
          create: dto.testCases.map((test) => ({
            input: test.input,
            output: test.output,
          })),
        },
      },
      include: { samples: true, testCases: true },
    });
  }

  findAll(page = 1, pageSize = 10) {
    const skip = (page - 1) * pageSize;

    return this.prismaService.problem.findMany({
      skip,
      take: pageSize,
      include: { samples: true, testCases: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(problemId: string) {
    const problem = await this.prismaService.problem.findUnique({
      where: { problemId },
      include: { samples: true, testCases: true },
    });

    if (!problem) {
      throw new NotFoundException('Задача не найдена');
    }

    return problem;
  }

  async update(problemId: string, dto: UpdateProblemDto) {
    return this.prismaService.problem.update({
      where: { problemId },
      data: {
        title: dto.title,
        description: dto.description,
        inputFormat: dto.inputFormat,
        outputFormat: dto.outputFormat,
        timeLimit: dto.timeLimit,
        memoryLimit: dto.memoryLimit,
        samples: dto.samples
          ? {
              deleteMany: {},
              create: dto.samples.map((sample) => ({
                input: sample.input,
                output: sample.output,
                explanation: sample.explanation,
              })),
            }
          : undefined,
        testCases: dto.testCases
          ? {
              deleteMany: {},
              create: dto.testCases.map((test) => ({
                input: test.input,
                output: test.output,
              })),
            }
          : undefined,
      },
      include: { samples: true, testCases: true },
    });
  }

  async remove(problemId: string) {
    return this.prismaService.problem.delete({
      where: { problemId },
    });
  }
}
