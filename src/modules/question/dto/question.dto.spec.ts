import { validate } from 'class-validator';
import { QuestionDto } from './question.dto';

describe('QuestionDto', () => {
  it('should validate correctly when type is valid', async () => {
    const questionDto = new QuestionDto();
    questionDto.formId = 1;
    questionDto.questionDescription = 'Test question';
    questionDto.type = 'single choice';
    questionDto.optionList = ['Option 1', 'Option 2'];

    const errors = await validate(questionDto);
    expect(errors.length).toBe(0);
  });

  it('should not validate when type is invalid', async () => {
    const questionDto = new QuestionDto();
    questionDto.formId = 1;
    questionDto.questionDescription = 'Test question';
    questionDto.type = 'invalid type';
    questionDto.optionList = ['Option 1', 'Option 2'];

    const errors = await validate(questionDto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isEnum', 'This type is not available');
  });
});
