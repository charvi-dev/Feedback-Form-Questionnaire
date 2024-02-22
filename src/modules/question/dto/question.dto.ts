import { IsEnum } from 'class-validator';
import { QUESTION_TYPE } from 'src/constants';

export class QuestionDto {
  formId: number;
  questionDescription: string;

  @IsEnum(
    [
      QUESTION_TYPE.SINGLE_CHOICE,
      QUESTION_TYPE.MULTIPLE_CHOICE,
      QUESTION_TYPE.RATING,
      QUESTION_TYPE.RANKING,
      QUESTION_TYPE.SINGLE_LINE,
      QUESTION_TYPE.MULTIPLE_LINE,
    ],
    { message: 'This type is not available' },
  )
  type: string;
  optionList: string[];
}
