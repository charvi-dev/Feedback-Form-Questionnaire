import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { FormService } from './modules/form/form.service';
import { QuestionService } from './modules/question/question.service';
import { InternalServerErrorException } from '@nestjs/common';
import { STATUS } from './constants';

describe('AppController', () => {
  let appController: AppController;
  let formService: FormService;
  let questionService: QuestionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    appController = module.get<AppController>(AppController);
    formService = module.get<FormService>(FormService);
    questionService = module.get<QuestionService>(QuestionService);
  });

  it('showForm should return form data when valid link is provided', async () => {
    const uuid = '09fe985f-85fb-404f-801c-7d0605d3f10a';
    const formData = {
      id: 1,
      title: 'Test Form',
      description: 'This is a test form',
      status: STATUS.PUBLISHED,
    };
    const questions = [
      { id: 1, text: 'Question 1' },
      { id: 2, text: 'Question 2' },
    ];

    (formService.findbyLink as jest.Mock).mockResolvedValue(formData);
    (questionService.findAll as jest.Mock).mockResolvedValue(questions);

    const result = await appController.showForm(uuid);

    expect(formService.findbyLink).toHaveBeenCalledWith(uuid);
    expect(questionService.findAll).toHaveBeenCalledWith(formData.id);
    expect(result).toEqual({
      Id: formData.id,
      Title: formData.title,
      Description: formData.description,
      status: formData.status,
      Questitons: questions,
    });
  });

  it('showForm should return "This link is not valid!" when invalid link is provided', async () => {
    const uuid = '09fe985f-85fb-404f-801c-7d0605d3f10a';

    (formService.findbyLink as jest.Mock).mockResolvedValue(null);

    const result = await appController.showForm(uuid);

    expect(formService.findbyLink).toHaveBeenCalledWith(uuid);
    expect(result).toEqual('This link is not valid!');
  });

  it('showForm should throw InternalServerErrorException when an error occurs', async () => {
    const uuid = '09fe985f-85fb-404f-801c-7d0605d3f10a';

    (formService.findbyLink as jest.Mock).mockRejectedValue('Some error');

    try {
      await appController.showForm(uuid);
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerErrorException);
    }
  });
});
