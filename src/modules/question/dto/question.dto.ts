import { IsArray, IsEnum } from 'class-validator';

export class QuestionDto {
  formId: number;
  questionDescription: string;
  
  @IsEnum(
    [
      'single choice',
      'multiple choice',
      'rating',
      'ranking',
      'single-line answer',
      'multi-line answer',
    ],
    { message:'This option is not availabel'},
  )
  type: string;

  @IsArray()
  optionList:string[]
}
