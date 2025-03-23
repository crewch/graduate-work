import { Test, TestingModule } from '@nestjs/testing';
import { ContestProblemController } from './contest-problem.controller';

describe('ContestProblemController', () => {
  let controller: ContestProblemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContestProblemController],
    }).compile();

    controller = module.get<ContestProblemController>(ContestProblemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
