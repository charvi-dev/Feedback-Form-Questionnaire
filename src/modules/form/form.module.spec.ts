import { Test, TestingModule } from '@nestjs/testing';
import { FormModule } from './form.module';
import { FormController } from './form.controller';
import { FormService } from './form.service';

describe('FormModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [FormModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide FormController', () => {
    const controller = module.get<FormController>(FormController);
    expect(controller).toBeDefined();
  });

  it('should provide FormService', () => {
    const service = module.get<FormService>(FormService);
    expect(service).toBeDefined();
  });
});
