import { Test, TestingModule } from '@nestjs/testing';
import { VisualIdentityService } from './visual-identity.service';

describe('VisualIdentityService', () => {
  let service: VisualIdentityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VisualIdentityService],
    }).compile();

    service = module.get<VisualIdentityService>(VisualIdentityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
