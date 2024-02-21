import { validate } from 'class-validator';
import { UpdateQuestionDto } from './update-question.dto';

describe('UpdateQuestionDto', () => {
  it('should create an instance of UpdateQuestionDto', () => {
    const updateQuestionDto = new UpdateQuestionDto();
    expect(updateQuestionDto).toBeDefined();
  });

  it('should validate correctly when type is valid', async () => {
    const updateQuestionDto = new UpdateQuestionDto();
    updateQuestionDto.formId = 1;
    updateQuestionDto.questionDescription = 'Test question';
    updateQuestionDto.type = 'single choice';
    updateQuestionDto.optionList = ['Option 1', 'Option 2'];

    const errors = await validate(updateQuestionDto);
    expect(errors.length).toBe(0);
  });

  it('should not validate when type is invalid', async () => {
    const updateQuestionDto = new UpdateQuestionDto();
    updateQuestionDto.formId = 1;
    updateQuestionDto.questionDescription = 'Test question';
    updateQuestionDto.type = 'invalid type';
    updateQuestionDto.optionList = ['Option 1', 'Option 2'];

    const errors = await validate(updateQuestionDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isEnum', 'This type is not available');
  });
});
