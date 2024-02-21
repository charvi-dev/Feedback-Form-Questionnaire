import { Question } from 'src/db/models/question.model';
import { QuestionService } from './question.service';
import { Option } from 'src/db/models/option.model';
import { InternalServerErrorException } from '@nestjs/common';

jest.mock('src/db/models/question.model', () => ({
  Question: {
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    destroy:jest.fn()
  },
}));

jest.mock('src/db/models/option.model', () => ({
  Option: {
    create: jest.fn(),
    findAll: jest.fn(),
  },
}));

describe('Question Service', () => {
  let service: QuestionService;

  beforeEach(() => {
    service = new QuestionService();
    (Option.findAll as jest.Mock).mockClear();
  });

  describe('add Quetsion', () => {
    it('should add a question with options successfully', async () => {
      const questionDetails = {
        formId: 1,
        questionDescription: 'Sample Question',
        type: 'multiple choice',
        optionList: ['Option 1', 'Option 2'],
      };

      (Question.create as jest.Mock).mockResolvedValue({ id: 1 });
      (Option.create as jest.Mock).mockResolvedValue({});

      const result = await service.addQuestion(questionDetails);
      expect(result).toBe('Question added successfully');
      expect(Question.create).toHaveBeenCalled();
      expect(Option.create).toHaveBeenCalledTimes(2);
    });

    it('should return a message when optionList is not given for multiple choice', async () => {
      const questionDetails = {
        formId: 1,
        questionDescription: 'Sample Question',
        type: 'multiple choice',
        optionList: [],
      };

      const result = await service.addQuestion(questionDetails);
      expect(result).toBe(
        'Option List should be given for multiple and single choice',
      );
    });

    it('should add a question without options successfully', async () => {
      const questionDetails = {
        formId: 1,
        questionDescription: 'Sample Question',
        type: 'text',
        optionList: null,
      };
      const result = await service.addQuestion(questionDetails);
      expect(result).toBe('Question added successfully');
    });

    it('should throw InternalServerErrorException on error', async () => {
      const questionDetails = {
        formId: 1,
        questionDescription: 'Sample Question',
        type: 'multiple choice',
        optionList: ['Option 1', 'Option 2'],
      };

      (Question.create as jest.Mock).mockRejectedValue('Data not Inserted');
      try {
        await service.addQuestion(questionDetails);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });

  describe('findAll', () => {
    it('should return all questions with options', async () => {
      const formId = 1;
      const mockQuestions = [
        {
          id: 1,
          formId: 1,
          questionDescription: 'Question 1',
          type: 'multiple choice',
        },
        {
          id: 2,
          formId: 1,
          questionDescription: 'Question 2',
          type: 'single choice',
        },
        {
          id: 3,
          formId: 1,
          questionDescription: 'Question 3',
          type: 'single-line answer',
        },
      ];
      const mockOptions = [
        [
          { id: 1, optionText: 'Option 1' },
          { id: 2, optionText: 'Option 2' },
        ],
        [{ id: 3, optionText: 'Option A' }],
        null,
      ];

      (Question.findAll as jest.Mock).mockResolvedValue(mockQuestions);
      (Option.findAll as jest.Mock).mockImplementation((options) => {
        const questionId = options.where.questionId;
        return Promise.resolve(mockOptions[questionId - 1]);
      });

      const result = await service.findAll(formId);

      expect(result).toEqual([
        {
          QuestionId: 1,
          Question: 'Question 1',
          Type: 'multiple choice',
          Option: mockOptions[0],
        },
        {
          QuestionId: 2,
          Question: 'Question 2',
          Type: 'single choice',
          Option: mockOptions[1],
        },
        { QuestionId: 3, Question: 'Question 3', Type: 'single-line answer' },
      ]);

      expect(Question.findAll).toHaveBeenCalledWith({
        where: { formId },
        order: [['id', 'ASC']],
      });
      expect(Option.findAll).toHaveBeenCalledTimes(2);
    });

    it('should return all questions without options', async () => {
      const formId = 1;
      const mockQuestions = [
        { id: 1, formId: 1, questionDescription: 'Question 1', type: 'text' },
        { id: 2, formId: 1, questionDescription: 'Question 2', type: 'text' },
      ];
      (Question.findAll as jest.Mock).mockResolvedValue(mockQuestions);
      (Option.findAll as jest.Mock).mockResolvedValue(null);

      const result = await service.findAll(formId);

      expect(result).toEqual([
        { QuestionId: 1, Question: 'Question 1', Type: 'text' },
        { QuestionId: 2, Question: 'Question 2', Type: 'text' },
      ]);
      expect(Question.findAll).toHaveBeenCalledWith({
        where: { formId },
        order: [['id', 'ASC']],
      });
      expect(Option.findAll).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException on error', async () => {
      const formId = 1;
      (Question.findAll as jest.Mock).mockRejectedValue('error');
      try {
        await service.findAll(1);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });

  describe('Update', () => {
    it('should update the question with the provided ID', async () => {
      const id = 1;
      const updateQuestionDto = {
        questionDescription: 'Updated Question Description',
      };
      (Question.update as jest.Mock).mockResolvedValue([1]);
      const result = await service.update(id, updateQuestionDto);
      expect(Question.update).toHaveBeenCalledWith(
        { questionDescription: updateQuestionDto.questionDescription },
        { where: { id } },
      );
      expect(result).toBe('Question Updated Successfully');
    });

    it('should throw InternalServerErrorException on error', async () => {
      const id = 1;
      const updateQuestionDto = {
        questionDescription: 'Updated Question Description',
      };
      (Question.update as jest.Mock).mockRejectedValue('DB Error');
      try {
        await service.update(id, updateQuestionDto);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
      }
      expect(Question.update).toHaveBeenCalledWith(
        { questionDescription: updateQuestionDto.questionDescription },
        { where: { id } },
      );
    });
  });

  describe('remove',()=>{
    it('should delete the question with the provided ID', async () => {
      const id = 1;
      (Question.destroy as jest.Mock).mockResolvedValue(1);
      const result = await service.remove(id);
      expect(Question.destroy).toHaveBeenCalledWith({ where: { id } });
      expect(result).toBe(`Question of Id ${id} is deleted!`);
    });

    it('should throw InternalServerErrorException on error', async () => {
      const id = 1;
      (Question.destroy as jest.Mock).mockRejectedValue("error");
      try {
        await service.remove(id)
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
      }
      expect(Question.destroy).toHaveBeenCalledWith({ where: { id } });
    });
  })
});
