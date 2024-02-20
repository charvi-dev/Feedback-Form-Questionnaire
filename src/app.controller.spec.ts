import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { FormService } from './modules/form/form.service';
import { QuestionService } from './modules/question/question.service';
import { NotFoundException } from '@nestjs/common';

jest.mock('./modules/form/form.service',()=>({
    FormService:{
        findbyLink:jest.fn(),
    }
}))

jest.mock('./modules/question/question.service',()=>({
    QuestionService:{
        findAll:jest.fn(),
    }
}))

describe('AppController', () => {
  let appController: AppController;
  let formService: FormService;
  let questionService: QuestionService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: FormService,
          useValue: {
            findbyLink: jest.fn(),
          },
        },
        {
          provide: QuestionService,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    formService = app.get<FormService>(FormService);
    questionService = app.get<QuestionService>(QuestionService);
  });

  describe('showForm', () => {
    it('should return form data when form is found', async () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      const formData = {
        id: 1,
        title: 'Test Form',
        description: 'This is a test form',
        status: 'published',
      };
      const questionsData = [
        { QuestionId: 1, Question: 'Question 1', Type: 'text' },
        { QuestionId: 2, Question: 'Question 2', Type: 'single choice', Option: ['Option 1', 'Option 2'] },
      ];
      (formService.findbyLink as jest.Mock).mockResolvedValue(formData);
      (questionService.findAll as jest.Mock).mockResolvedValue(questionsData);

      const result = await appController.showForm(uuid);

      expect(result).toEqual({
        Id: 1,
        Title: 'Test Form',
        Description: 'This is a test form',
        status: 'published',
        Questitons: questionsData,
      });
    });

    it('should return "Form Not Published!" when form is in draft status', async () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      const formData = {
        id: 1,
        title: 'Test Form',
        description: 'This is a test form',
        status: 'draft',
      };
      (formService.findbyLink as jest.Mock).mockResolvedValue(formData);

      const result = await appController.showForm(uuid);

      expect(result).toBe('Form Not Published!');
    });

    it('should return "Form is not accepting any responses now!" when form is in closed status', async () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      const formData = {
        id: 1,
        title: 'Test Form',
        description: 'This is a test form',
        status: 'closed',
      };
      (formService.findbyLink as jest.Mock).mockResolvedValue(formData);

      const result = await appController.showForm(uuid);

      expect(result).toBe('Form is not accepting any responses now!');
    });

    it('should throw NotFoundException when form is not found', async () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      (formService.findbyLink as jest.Mock).mockResolvedValue(null);

      await expect(appController.showForm(uuid)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when an error occurs', async () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      (formService.findbyLink as jest.Mock).mockRejectedValue(new Error('DB Error'));

      await expect(appController.showForm(uuid)).rejects.toThrow(NotFoundException);
    });
  });
});
