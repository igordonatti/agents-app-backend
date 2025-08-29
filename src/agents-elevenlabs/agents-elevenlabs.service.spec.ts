import { Test, TestingModule } from '@nestjs/testing';
import { AgentsElevenlabsService } from './agents-elevenlabs.service';

describe('AgentsElevenlabsService', () => {
  let service: AgentsElevenlabsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgentsElevenlabsService],
    }).compile();

    service = module.get<AgentsElevenlabsService>(AgentsElevenlabsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
