import { Test, TestingModule } from '@nestjs/testing';
import { ContestsService } from './contests.service';

describe('ContestsService', () => {
  let service: ContestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContestsService],
    }).compile();

    service = module.get<ContestsService>(ContestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
