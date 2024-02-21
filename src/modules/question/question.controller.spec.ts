import { Test, TestingModule } from '@nestjs/testing';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { QuestionDto } from './dto/question.dto';

describe('QuestionController', () => {
  let controller: QuestionController;
  let service: QuestionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionController],
      providers: [{
        provide:QuestionService,
        useValue:{
            addQuestion:jest.fn(),
            findAll:jest.fn(),
            update:jest.fn(),
            remove:jest.fn()
        }
      }],
    }).compile();

    controller = module.get<QuestionController>(QuestionController);
    service = module.get<QuestionService>(QuestionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addQuestion', () => {
    it('should add a new question', async () => {
      const questionDetails: QuestionDto = {
        formId:1,
        optionList:null,
        questionDescription:"question",
        type:"single-line"
      };

      const expectedResult = 'Question added successfully';
      
      (service.addQuestion as jest.Mock).mockResolvedValue(expectedResult);
      
      const result = await controller.addQuestion(questionDetails);
      
      expect(service.addQuestion).toHaveBeenCalledWith(questionDetails);
      expect(result).toBe(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should find all questions for a form', async () => {
      const formId = 1;
      const expectedResult = []; 
      
      (service.findAll as jest.Mock).mockResolvedValue(expectedResult);
      
      const result = await controller.findAll(formId);
      
      expect(service.findAll).toHaveBeenCalledWith(formId);
      expect(result).toBe(expectedResult);
    });
  });

  describe('update', () => {
    it('should update an existing question', async () => {
      const questionId = 1; 
      const updatedDetails: QuestionDto = {
        questionDescription:"Question",
        formId:1,
        optionList:null,
        type:"single-line answer"
      };
      const expectedResult = 'Question updated successfully';
      
      (service.update as jest.Mock).mockResolvedValue(expectedResult);
      
      const result = await controller.update(questionId, updatedDetails);
      
      expect(service.update).toHaveBeenCalledWith(questionId, updatedDetails);
      expect(result).toBe(expectedResult);
    });
  });

  describe('remove', () => {
    it('should remove an existing question', async () => {
      const questionId = 1; 
      const expectedResult = 'Question removed successfully';
      
      (service.remove as jest.Mock).mockResolvedValue(expectedResult);
      
      const result = await controller.remove(questionId);
      
      expect(service.remove).toHaveBeenCalledWith(questionId);
      expect(result).toBe(expectedResult);
    });
  });

});
