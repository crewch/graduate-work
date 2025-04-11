import { Test, TestingModule } from '@nestjs/testing';
import { JudgeController } from './judge.controller';
import { JudgeService } from './judge.service';

describe('JudgeController', () => {
  let controller: JudgeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JudgeController],
      providers: [JudgeService],
    }).compile();

    controller = module.get<JudgeController>(JudgeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
