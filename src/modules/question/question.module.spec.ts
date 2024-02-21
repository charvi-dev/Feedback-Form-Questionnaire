import { Test, TestingModule } from '@nestjs/testing';
import { QuestionModule } from './question.module';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';

describe('QuestionModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [QuestionModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide QuestionController', () => {
    const controller = module.get<QuestionController>(QuestionController);
    expect(controller).toBeDefined();
  });

  it('should provide QuestionService', () => {
    const service = module.get<QuestionService>(QuestionService);
    expect(service).toBeDefined();
  });
});
