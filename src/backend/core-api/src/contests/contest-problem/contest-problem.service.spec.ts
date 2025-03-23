import { Test, TestingModule } from '@nestjs/testing';
import { ContestProblemService } from './contest-problem.service';

describe('ContestProblemService', () => {
  let service: ContestProblemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContestProblemService],
    }).compile();

    service = module.get<ContestProblemService>(ContestProblemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
