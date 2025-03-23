import { Test, TestingModule } from '@nestjs/testing';
import { TokenStorageService } from './token-storage.service';

describe('TokenStorageService', () => {
  let service: TokenStorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenStorageService],
    }).compile();

    service = module.get<TokenStorageService>(TokenStorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
