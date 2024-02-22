import { BadRequestException } from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { Form } from 'src/db/models/form.model';
import { Question } from 'src/db/models/question.model';
import { Submission } from 'src/db/models/submission.model';
import { CreateSubmissionDto } from './dto/create.submission.dto';

 
 
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
                formResponse: [{ questionId: 1, response: 'Answer 1' }]
            };
            (Form.findByPk as jest.Mock).mockResolvedValueOnce({});
            (Submission.create as jest.Mock).mockResolvedValueOnce(createSubmissionDto);
 
            const result = await submissionService.create(createSubmissionDto);
 
            expect(result).toEqual(createSubmissionDto);
        });
 
        it('should throw BadRequestException if form does not exist', async () => {
            const createSubmissionDto: CreateSubmissionDto = {
                formId: 1,
                submissionDate: new Date(),
                formResponse: [{ questionId: 1, response: 'Answer 1' }]
            };
            (Form.findByPk as jest.Mock).mockResolvedValueOnce(null);
 
            await expect(submissionService.create(createSubmissionDto)).rejects.toThrow(BadRequestException);
        });
    });
 
 
    describe('formatSubmission', () => {
        it('should format submission correctly', async () => {
            const formResponse = [
                { questionId: 1, response: 'Answer 1' },
                { questionId: 2, response: 'Answer 2' }
            ];
 
            // Mock Question.findByPk method
            (Question.findByPk as jest.Mock).mockImplementation(async (questionId: number) => {
                // Mock data for Question model
                if (questionId === 1) {
                    return { id: 1, questionDescription: 'Question 1' };
                } else if (questionId === 2) {
                    return { id: 2, questionDescription: 'Question 2' };
                }
            });
 
            const result = await submissionService.formatSubmission(formResponse);
 
            expect(result).toEqual([
                { questionId: 1, text: 'Question 1', response: 'Answer 1' },
                { questionId: 2, text: 'Question 2', response: 'Answer 2' }
            ]);
        });
    });
 
   
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
    describe('findAll', () => {
        it('should find all submissions for a form', async () => {
          const mockSubmissions = [
            { id: 1, formId: 1, submissionDate: new Date(), formResponse: [{ questionId: 1, response: 'Sample response' }] },
            { id: 2, formId: 1, submissionDate: new Date(), formResponse: [{ questionId: 2, response: 'Another response' }] },
          ];
       
          (Submission.findAll as jest.Mock).mockResolvedValueOnce(mockSubmissions);
   
         
          submissionService.formatSubmissionData = jest.fn().mockImplementation(submission => {
         
            return {
              submissionId: submission.id,
              formId: submission.formId,
              submittedOn: submission.submissionDate,
              questions: submission.formResponse.map(response => ({
                questionId: response.questionId,
                text: `Question ${response.questionId}`,
                response: response.response,
              })),
            };
          });
   
     
          const result = await submissionService.findAll(1);
   
         
          expect(result).toHaveLength(2);
          expect(result[0].submissionId).toEqual(1);
          expect(result[0].formId).toEqual(1);
          expect(result[0].questions).toHaveLength(1);
          expect(result[0].questions[0].questionId).toEqual(1);
     
        });
   
        it('should throw BadRequestException if an error occurs', async () => {
         
          (Submission.findAll as jest.Mock).mockRejectedValueOnce(new Error('Database error'));
   
         
          await expect(submissionService.findAll(1)).rejects.toThrow(BadRequestException);
        });
      });
      describe('findByPk', () => {
        it('should find a submission by formId and submissionId', async () => {
          // Mock data for submission
          const formId = 1;
          const submissionId = 1;
          const submissionData = {
            id: submissionId,
            formId: formId,
            submissionDate: new Date(),
            formResponse: [{ questionId: 1, response: 'Sample response' }]
          };
       
          (Submission.findOne as jest.Mock).mockResolvedValueOnce(submissionData);
   
         
          submissionService.formatSubmissionData = jest.fn().mockResolvedValueOnce({
            submissionId: submissionData.id,
            formId: submissionData.formId,
            submittedOn: submissionData.submissionDate,
            questions: submissionData.formResponse.map(response => ({
              questionId: response.questionId,
              text: `Question ${response.questionId}`,
              response: response.response,
            })),
          });
   
       
          const result = await submissionService.findByPk(formId, submissionId);
   
         
          expect(result.submissionId).toEqual(submissionId);
          expect(result.formId).toEqual(formId);
          expect(result.questions).toHaveLength(1);
          expect(result.questions[0].questionId).toEqual(1);
         
        });
   
        it('should throw BadRequestException if submission is not found', async () => {
       
          const formId = 1;
          const submissionId = 1;
       
          (Submission.findOne as jest.Mock).mockResolvedValueOnce(null);
 
          await expect(submissionService.findByPk(formId, submissionId)).rejects.toThrow(BadRequestException);
        });
      })
   
});