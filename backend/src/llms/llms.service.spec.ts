import { Test, TestingModule } from '@nestjs/testing';
import { LlmsService } from './llms.service';
import { ConfigModule } from '@nestjs/config';

describe('LlmsService', () => {
  let service: LlmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LlmsService],
      imports: [
        ConfigModule.forRoot({
          envFilePath: ['.env'],
        }),
      ],
    }).compile();

    service = module.get<LlmsService>(LlmsService);
  });

  it('should return a string', async () => {
    expect(await service.fetchAnswer('What is a test?')).toEqual(
      expect.any(String),
    );
  });

  it('should return a JSON array', async () => {
    expect(await service.upsertKnowledgeGraph("Bob is Tina's father.")).toEqual(
      expect.any(Object),
    );
  });
});
