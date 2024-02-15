import { Injectable, InternalServerErrorException} from '@nestjs/common';
import { QuestionDto } from './dto/question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from 'src/db/models/question.model';
import { Option } from 'src/db/models/option.model';

@Injectable()
export class QuestionService {
  async addQuestion(questionDetails: QuestionDto) {
    const data = {
      formId:questionDetails.formId,
      questionDescription:questionDetails.questionDescription,
      type:questionDetails.type
    }
    try {
      const question = await Question.create(data)
      if(question.type==='multiple choice' || question.type==='single choice'){
        if(questionDetails.optionList.length){
          questionDetails.optionList.forEach(async (option)=>{
            await Option.create({questionId:question.id,optionText:option})
          })
        }else{
          return "Option List should be given for multi and single choice";
        }
      }

      return "Question added successfully";
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  findAll(formId: number) {
    return `This action returns all question of a particlar form`;
  }

  update(id: number, updateQuestionDto: UpdateQuestionDto) {
    return updateQuestionDto;
  }

  remove(id: number) {
    return `This action removes a #${id} question`;
  }
}
