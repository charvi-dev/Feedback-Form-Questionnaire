import { Test, TestingModule } from '@nestjs/testing';
import { SubmissionController } from './submission.controller';
import { SubmissionService } from './submission.service';
import { CreateSubmissionDto } from './dto/create.submission.dto';

describe('SubmissionController', () => {
  let controller: SubmissionController;
  let submissionService: SubmissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubmissionController],
      providers: [
        {
          provide: SubmissionService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SubmissionController>(SubmissionController);
    submissionService = module.get<SubmissionService>(SubmissionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call submissionService.create with the provided data', async () => {
      const createSubmissionDto: CreateSubmissionDto = {
        formId: 1,
        submissionDate: new Date(),
        formResponse: { key: 'value' },
      };

      await controller.create(createSubmissionDto);

      expect(submissionService.create).toHaveBeenCalledWith(
        createSubmissionDto,
      );
    });
  });

  describe('findAll', () => {
    it('should call submissionService.findAll with the provided formId', async () => {
      const formId = 1;

      await controller.findAll(formId);

      expect(submissionService.findAll).toHaveBeenCalledWith(formId);
    });
  });
});
