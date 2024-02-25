import { BadRequestException } from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { Form } from 'src/db/models/form.model';
import { Question } from 'src/db/models/question.model';
import { Submission } from 'src/db/models/submission.model';
import { CreateSubmissionDto } from './dto/create.submission.dto';
import { QUESTION_TYPE } from 'src/constants';
 
jest.mock('src/db/models/form.model');
jest.mock('src/db/models/question.model');
jest.mock('src/db/models/submission.model');
 
describe('SubmissionService', () => {
  let submissionService: SubmissionService;
 
  beforeEach(() => {
    submissionService = new SubmissionService();
  });
 
  describe('validateSubmission', () => {
    it('should validate submission responses when valid', async () => {
      const formResponse = [
        { questionId: 1, response: 'Valid response' },
        { questionId: 2, response: 'Valid response' },
      ];
 
      (Question.findByPk as jest.Mock).mockImplementation(async (questionId: number) => {
        if (questionId === 1) {
          return { id: 1, type: QUESTION_TYPE.SINGLE_LINE };
        } else if (questionId === 2) {
          return { id: 2, type: QUESTION_TYPE.MULTIPLE_LINE };
        }
      });
 
      await expect(submissionService.validateSubmission(formResponse)).resolves.toBeUndefined();
    });
 
    it('should throw BadRequestException for invalid submission', async () => {
            const formResponse = [
              { questionId: 1, response: 'Invalid response' },
              { questionId: 2, response: 'Valid response' },
            ];
       
            (Question.findByPk as jest.Mock).mockImplementation(async (questionId: number) => {
              if (questionId === 1) {
                return { id: 1, type: QUESTION_TYPE.SINGLE_LINE };
              } else if (questionId === 2) {
                return { id: 2, type: QUESTION_TYPE.MULTIPLE_LINE };
              }
            });
       
            try {
              await submissionService.validateSubmission(formResponse);
            } catch (error) {
              expect(error).toBeInstanceOf(BadRequestException);
              expect(error.message).toContain('Invalid submission');
            }
          });
          it('should validate single-line response within char limit', async () => {
            const formResponse = [{ questionId: 1, response: 'Valid response' }];
     
            (Question.findByPk as jest.Mock).mockResolvedValueOnce({ id: 1, type: QUESTION_TYPE.SINGLE_LINE });
     
            await expect(submissionService.validateSubmission(formResponse)).resolves.toBeUndefined();
          });
          it('should throw BadRequestException for single-line response exceeding char limit', async () => {
            const formResponse = [{ questionId: 1, response: 'a'.repeat(201) }];
     
            (Question.findByPk as jest.Mock).mockResolvedValueOnce({ id: 1, type: QUESTION_TYPE.SINGLE_LINE });
     
            await expect(submissionService.validateSubmission(formResponse)).rejects.toThrow(BadRequestException);
          });
          it('should validate multiple-line response within char limit', async () => {
            const formResponse = [{ questionId: 1, response: 'Valid response' }];
     
            (Question.findByPk as jest.Mock).mockResolvedValueOnce({ id: 1, type: QUESTION_TYPE.MULTIPLE_LINE });
     
            await expect(submissionService.validateSubmission(formResponse)).resolves.toBeUndefined();
          });
          it('should throw BadRequestException for multiple-line response exceeding char limit', async () => {
            const formResponse = [{ questionId: 1, response: 'a'.repeat(501) }];
     
            (Question.findByPk as jest.Mock).mockResolvedValueOnce({ id: 1, type: QUESTION_TYPE.MULTIPLE_LINE });
     
            await expect(submissionService.validateSubmission(formResponse)).rejects.toThrow(BadRequestException);
          });
          it('should validate rating response within range', async () => {
            const formResponse = [{ questionId: 1, response: 4 }];
     
            (Question.findByPk as jest.Mock).mockResolvedValueOnce({ id: 1, type: QUESTION_TYPE.RATING });
     
            await expect(submissionService.validateSubmission(formResponse)).resolves.toBeUndefined();
          });
          it('should throw BadRequestException for rating response out of range', async () => {
            const formResponse = [{ questionId: 1, response: 6 }];
     
            (Question.findByPk as jest.Mock).mockResolvedValueOnce({ id: 1, type: QUESTION_TYPE.RATING });
     
            await expect(submissionService.validateSubmission(formResponse)).rejects.toThrow(BadRequestException);
          });
          it('should validate ranking response within range', async () => {
            const formResponse = [{ questionId: 1, response: 8 }];
     
            (Question.findByPk as jest.Mock).mockResolvedValueOnce({ id: 1, type: QUESTION_TYPE.RANKING });
     
            await expect(submissionService.validateSubmission(formResponse)).resolves.toBeUndefined();
          });
          it('should throw BadRequestException for ranking response out of range', async () => {
            const formResponse = [{ questionId: 1, response: 0 }];
     
            (Question.findByPk as jest.Mock).mockResolvedValueOnce({ id: 1, type: QUESTION_TYPE.RANKING });
     
            await expect(submissionService.validateSubmission(formResponse)).rejects.toThrow(BadRequestException);
          });
          it('should validate single-choice response with length 1', async () => {
            const formResponse = [{ questionId: 1, response: ['Choice 1'] }];
     
            (Question.findByPk as jest.Mock).mockResolvedValueOnce({ id: 1, type: QUESTION_TYPE.SINGLE_CHOICE });
     
            await expect(submissionService.validateSubmission(formResponse)).resolves.toBeUndefined();
          });
          it('should throw BadRequestException for single-choice response with length > 1', async () => {
            const formResponse = [{ questionId: 1, response: ['Choice 1', 'Choice 2'] }];
     
            (Question.findByPk as jest.Mock).mockResolvedValueOnce({ id: 1, type: QUESTION_TYPE.SINGLE_CHOICE });
     
            await expect(submissionService.validateSubmission(formResponse)).rejects.toThrow(BadRequestException);
          });      
     
  });
 
  describe('create', () => {
    it('should create submission if form exists and submission is valid', async () => {
      const createSubmissionDto: CreateSubmissionDto = {
        formId: 1,
        submissionDate: new Date(),
        formResponse: [{ questionId: 1, response: 'Answer 1' }],
      };
      (Form.findByPk as jest.Mock).mockResolvedValueOnce({});
      jest.spyOn(submissionService, 'validateSubmission').mockResolvedValueOnce();
      (Submission.create as jest.Mock).mockResolvedValueOnce(createSubmissionDto);
 
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
 
      await expect(submissionService.create(createSubmissionDto)).rejects.toThrow(BadRequestException);
    });
 
    it('should throw BadRequestException if submission is invalid', async () => {
      const createSubmissionDto: CreateSubmissionDto = {
        formId: 1,
        submissionDate: new Date(),
        formResponse: [{ questionId: 1, response: 'Invalid response' }],
      };
      (Form.findByPk as jest.Mock).mockResolvedValueOnce({});
      jest.spyOn(submissionService, 'validateSubmission').mockRejectedValueOnce(new Error('Invalid submission'));
 
      await expect(submissionService.create(createSubmissionDto)).rejects.toThrow(BadRequestException);
    });
  });
 
  describe('formatSubmission', () => {
    it('should format submission correctly', async () => {
      const formResponse = [
        { questionId: 1, response: 'Answer 1' },
        { questionId: 2, response: 'Answer 2' },
      ];
 
      (Question.findByPk as jest.Mock).mockImplementation(async (questionId: number) => {
        if (questionId === 1) {
          return { id: 1, questionDescription: 'Question 1' };
        } else if (questionId === 2) {
          return { id: 2, questionDescription: 'Question 2' };
        }
      });
 
      const result = await submissionService.formatSubmission(formResponse);
 
      expect(result).toEqual([
        { questionId: 1, text: 'Question 1', response: 'Answer 1' },
        { questionId: 2, text: 'Question 2', response: 'Answer 2' },
      ]);
    });
  });
 
  describe('formatSubmissionData', () => {
    it('should format submission data correctly', async () => {
      const submission = {
        id: 1,
        formId: 1,
        formResponse: [
          { questionId: 1, response: 'Answer 1' },
          { questionId: 2, response: 'Answer 2' },
        ],
      } as Submission;
 
      submissionService.formatSubmission = jest.fn().mockResolvedValueOnce([
        { questionId: 1, text: 'Question 1', response: 'Answer 1' },
        { questionId: 2, text: 'Question 2', response: 'Answer 2' },
      ]);
 
      const result = await submissionService.formatSubmissionData(submission);
 
      expect(result).toEqual({
        submissionId: 1,
        formId: 1,
        questions: [
          { questionId: 1, text: 'Question 1', response: 'Answer 1' },
          { questionId: 2, text: 'Question 2', response: 'Answer 2' },
        ],
      });
    });
  });
 
  describe('findAll', () => {
    it('should return formatted submissions for a valid form ID', async () => {
      const formId = 1;
      const mockSubmissions = [
        { id: 1, formId: 1, formResponse: [{ questionId: 1, response: 'Sample response' }] },
        { id: 2, formId: 1, formResponse: [{ questionId: 2, response: 'Another response' }] }
      ];
      const mockFormattedSubmissions = [
        { submissionId: 1, formId: 1, questions: [{ questionId: 1, text: 'Question 1', response: 'Sample response' }] },
        { submissionId: 2, formId: 1, questions: [{ questionId: 2, text: 'Question 2', response: 'Another response' }] }
      ];
      const mockForm = { id: 1, name: 'Form 1' };

      (Submission.findAll as jest.Mock).mockResolvedValueOnce(mockSubmissions);
      (Form.findByPk as jest.Mock).mockResolvedValueOnce(mockForm);
      submissionService.formatSubmissionData = jest.fn().mockImplementation((submission) => {
        const formattedSubmission = mockFormattedSubmissions.find(s => s.submissionId === submission.id);
        return formattedSubmission ? formattedSubmission : null;
      });

      const result = await submissionService.findAll(formId);

      expect(result).toEqual(mockFormattedSubmissions);
      expect(Submission.findAll).toHaveBeenCalledWith({ where: { formId: formId } });
      expect(Form.findByPk).toHaveBeenCalledWith(formId);
    });
    it('should throw BadRequestException for an invalid form ID', async () => {
      const formId = 2;
      const mockSubmissions = [];
      const mockForm = null;

      (Submission.findAll as jest.Mock).mockResolvedValueOnce(mockSubmissions);
      (Form.findByPk as jest.Mock).mockResolvedValueOnce(mockForm);

      await expect(submissionService.findAll(formId)).rejects.toThrowError(BadRequestException);
      expect(Submission.findAll).toHaveBeenCalledWith({ where: { formId: formId } });
      expect(Form.findByPk).toHaveBeenCalledWith(formId);
    });
    it('should throw BadRequestException if no submissions found for the given form ID', async () => {
      const formId = 3;
      const mockSubmissions = [];
      const mockForm = { id: 3, name: 'Form 3' };

  
      (Submission.findAll as jest.Mock).mockResolvedValueOnce(mockSubmissions);
      (Form.findByPk as jest.Mock).mockResolvedValueOnce(mockForm);

      await expect(submissionService.findAll(formId)).rejects.toThrowError(BadRequestException);
      expect(Submission.findAll).toHaveBeenCalledWith({ where: { formId: formId } });
      expect(Form.findByPk).toHaveBeenCalledWith(formId);
    });

 
    it('should throw BadRequestException if an error occurs', async () => {
      (Submission.findAll as jest.Mock).mockRejectedValueOnce(
        new Error('Database error'),
      );
 
      await expect(submissionService.findAll(1)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
 
  describe('findByPk', () => {
    it('should find a submission by formId and submissionId', async () => {
      const formId = 1;
      const submissionId = 1;
      const submissionData = {
        id: submissionId,
        formId: formId,
        formResponse: [{ questionId: 1, response: 'Sample response' }],
      };
 
      (Submission.findOne as jest.Mock).mockResolvedValueOnce(submissionData);
 
      submissionService.formatSubmissionData = jest.fn().mockResolvedValueOnce({
        submissionId: submissionData.id,
        formId: submissionData.formId,
        questions: submissionData.formResponse.map((response) => ({
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
 
      await expect(
        submissionService.findByPk(formId, submissionId),
      ).rejects.toThrow(BadRequestException);
    });
  });
});