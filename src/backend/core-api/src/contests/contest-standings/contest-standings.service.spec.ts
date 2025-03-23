import { Test, TestingModule } from '@nestjs/testing';
import { ContestStandingsService } from './contest-standings.service';

describe('ContestStandingsService', () => {
  let service: ContestStandingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContestStandingsService],
    }).compile();

    service = module.get<ContestStandingsService>(ContestStandingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
