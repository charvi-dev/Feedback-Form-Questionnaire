import { Test, TestingModule } from '@nestjs/testing';
import { SubmissionModule } from './submission.module';
import { SubmissionService } from './submission.service';
import { SubmissionController } from './submission.controller';

describe('SubmissionModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [SubmissionModule],
    }).compile();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should resolve SubmissionService', () => {
    const submissionService = module.get<SubmissionService>(SubmissionService);
    expect(submissionService).toBeDefined();
  });

  it('should resolve SubmissionController', () => {
    const submissionController =
      module.get<SubmissionController>(SubmissionController);
    expect(submissionController).toBeDefined();
  });
});
