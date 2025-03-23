import { Test, TestingModule } from '@nestjs/testing';
import { ContestsController } from './contests.controller';
import { ContestsService } from './contests.service';

describe('ContestsController', () => {
  let controller: ContestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContestsController],
      providers: [ContestsService],
    }).compile();

    controller = module.get<ContestsController>(ContestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
