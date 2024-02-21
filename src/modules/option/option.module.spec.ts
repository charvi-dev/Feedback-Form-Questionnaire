import { Test, TestingModule } from '@nestjs/testing';
import { OptionModule } from './option.module';
import { OptionController } from './option.controller';
import { OptionService } from './option.service';

describe('OptionModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [OptionModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide OptionController', () => {
    const controller = module.get<OptionController>(OptionController);
    expect(controller).toBeDefined();
  });

  it('should provide OptionService', () => {
    const service = module.get<OptionService>(OptionService);
    expect(service).toBeDefined();
  });
});
