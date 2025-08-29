import { Test, TestingModule } from '@nestjs/testing';
import { AgentsElevenlabsController } from './agents-elevenlabs.controller';

describe('AgentsElevenlabsController', () => {
  let controller: AgentsElevenlabsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgentsElevenlabsController],
    }).compile();

    controller = module.get<AgentsElevenlabsController>(AgentsElevenlabsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
