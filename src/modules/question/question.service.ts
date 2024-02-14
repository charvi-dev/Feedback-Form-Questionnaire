import { Injectable } from '@nestjs/common';
import { QuestionDto } from './dto/question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionService {
  create(createQuestionDto: QuestionDto) {
    return 'This action adds a new question';
  }

  findAll(formId:number) {
    return `This action returns all question of a particlar form`;
  }

  update(id: number, updateQuestionDto: UpdateQuestionDto) {
    return updateQuestionDto;
  }

  remove(id: number) {
    return `This action removes a #${id} question`;
  }
}
