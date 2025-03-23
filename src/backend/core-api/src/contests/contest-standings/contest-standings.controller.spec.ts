import { Test, TestingModule } from '@nestjs/testing';
import { ContestStandingsController } from './contest-standings.controller';

describe('ContestStandingsController', () => {
  let controller: ContestStandingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContestStandingsController],
    }).compile();

    controller = module.get<ContestStandingsController>(
      ContestStandingsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
