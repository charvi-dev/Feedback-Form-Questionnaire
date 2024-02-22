import { BadRequestException } from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { Form } from 'src/db/models/form.model';
import { Question } from 'src/db/models/question.model';
import { Submission } from 'src/db/models/submission.model';
import { CreateSubmissionDto } from './dto/create.submission.dto';
import { Sequelize } from 'sequelize';


jest.mock('src/db/models/form.model');
jest.mock('src/db/models/question.model');
jest.mock('src/db/models/submission.model');

describe('SubmissionService', () => {
  let submissionService: SubmissionService;

  beforeEach(() => {
    submissionService = new SubmissionService();
  });

  describe('create', () => {
    it('should create submission if form exists', async () => {
      const createSubmissionDto: CreateSubmissionDto = {
        formId: 1,
        submissionDate: new Date(),
        formResponse: [{ questionId: 1, response: 'Answer 1' }],
      };
      (Form.findByPk as jest.Mock).mockResolvedValueOnce({});
      (Submission.create as jest.Mock).mockResolvedValueOnce(
        createSubmissionDto,
      );

      const result = await submissionService.create(createSubmissionDto);

      expect(result).toEqual(createSubmissionDto);
    });

    it('should throw BadRequestException if form does not exist', async () => {
      const createSubmissionDto: CreateSubmissionDto = {
        formId: 1,
        submissionDate: new Date(),
        formResponse: [{ questionId: 1, response: 'Answer 1' }],
      };
      (Form.findByPk as jest.Mock).mockResolvedValueOnce(null);

      await expect(
        submissionService.create(createSubmissionDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('formatSubmission', () => {
    it('should format submission correctly', async () => {
      const formResponse = [
        { questionId: 1, response: 'Answer 1' },
        { questionId: 2, response: 'Answer 2' },
      ];

      // Mock Question.findByPk method
      (Question.findByPk as jest.Mock).mockImplementation(
        async (questionId: number) => {
          // Mock data for Question model
          if (questionId === 1) {
            return { id: 1, questionDescription: 'Question 1' };
          } else if (questionId === 2) {
            return { id: 2, questionDescription: 'Question 2' };
          }
        },
      );

      const result = await submissionService.formatSubmission(formResponse);

            expect(result).toEqual([
                { questionId: 1, text: 'Question 1', response: 'Answer 1' },
                { questionId: 2, text: 'Question 2', response: 'Answer 2' }
            ]);
        });
    });

    interface PartialSubmission {
        id: number;
        formId: number;
        formResponse: { questionId: number; response: string }[];
    }
    

    describe('formatSubmissionData', () => {
        it('should format submission data correctly', async () => {
            const submission= {
                id: 1,
                formId: 1,
                formResponse: [
                    { questionId: 1, response: 'Answer 1' },
                    { questionId: 2, response: 'Answer 2' }
                ]
            } as Submission;

            // Mock formatSubmission method
            submissionService.formatSubmission = jest.fn().mockResolvedValueOnce([
                { questionId: 1, text: 'Question 1', response: 'Answer 1' },
                { questionId: 2, text: 'Question 2', response: 'Answer 2' }
            ]);

      const result = await submissionService.formatSubmissionData(submission);

            expect(result).toEqual({
                submissionId: 1,
                formId: 1,
                questions: [
                    { questionId: 1, text: 'Question 1', response: 'Answer 1' },
                    { questionId: 2, text: 'Question 2', response: 'Answer 2' }
                ]
            });
        });
    });
    
});
