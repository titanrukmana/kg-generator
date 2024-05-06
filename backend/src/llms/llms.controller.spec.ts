import { Test, TestingModule } from '@nestjs/testing';
import { LlmsController } from './llms.controller';
import { ConfigModule } from '@nestjs/config';
import { LlmsService } from './llms.service';

describe('LlmsController', () => {
  let controller: LlmsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({})],
      controllers: [LlmsController],
      providers: [LlmsService],
    }).compile();

    controller = module.get<LlmsController>(LlmsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
