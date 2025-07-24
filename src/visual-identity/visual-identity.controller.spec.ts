import { Test, TestingModule } from '@nestjs/testing';
import { VisualIdentityController } from './visual-identity.controller';

describe('VisualIdentityController', () => {
  let controller: VisualIdentityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VisualIdentityController],
    }).compile();

    controller = module.get<VisualIdentityController>(VisualIdentityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
