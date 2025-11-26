import { Test, TestingModule } from '@nestjs/testing';
import { ApiKeyStrategy } from '../api-key.strategy';

describe('ApiKeyStrategy', () => {
  let provider: ApiKeyStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiKeyStrategy],
    }).compile();

    provider = module.get<ApiKeyStrategy>(ApiKeyStrategy);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
