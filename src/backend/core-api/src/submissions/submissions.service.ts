import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { PrismaService } from 'nestjs-prisma';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { SubmissionStatus } from '@prisma/client';

@Injectable()
export class SubmissionsService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('SUBMISSION_KAFKA_CLIENT')
    private readonly kafkaClient: ClientKafka,
  ) {}

  async createSubmission(userId: string, dto: CreateSubmissionDto) {
    const submission = await this.prismaService.submission.create({
      data: { userId, verdict: SubmissionStatus.PENDING, ...dto },
    });

    this.kafkaClient.emit('submission.created', submission.submissionId);

    return submission;
  }

  getSubmissionResult(userId: string, contestId: string) {
    return this.prismaService.submission.findMany({
      where: {
        userId,
        contestId,
      },
      orderBy: {
        submissionTime: 'desc',
      },
      include: {
        results: {
          take: 1,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }
}
