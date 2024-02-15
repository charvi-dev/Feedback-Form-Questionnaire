import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { QuestionDto } from './dto/question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from 'src/db/models/question.model';
import { Option } from 'src/db/models/option.model';

@Injectable()
export class QuestionService {
  async addQuestion(questionDetails: QuestionDto) {
    const data = {
      formId: questionDetails.formId,
      questionDescription: questionDetails.questionDescription,
      type: questionDetails.type,
    };
    try {
      const question = await Question.create(data);
      if (
        question.type === 'multiple choice' ||
        question.type === 'single choice'
      ) {
        if (questionDetails.optionList && questionDetails.optionList.length) {
          questionDetails.optionList.forEach(async (option) => {
            await Option.create({
              questionId: question.id,
              optionText: option,
            });
          });
        } else {
          return 'Option List should be given for multiple and single choice';
        }
      }

      return 'Question added successfully';
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findAll(formId: number) {
    try {
      let result = [];
      let allQuestions = await Question.findAll({ where: { formId: formId } });
      for (let i = 0; i < allQuestions.length; i++) {
        let allOptions = null;
        if (
          allQuestions[i]['type'] === 'multiple choice' ||
          allQuestions[i]['type'] === 'single choice'
        ) {
          allOptions = await Option.findAll({
            where: { questionId: allQuestions[i]['id'] },
            attributes: ['id', 'optionText'],
          });
        }
        let questionDetails = {};
        if (allOptions) {
          questionDetails['QuestionId'] = allOptions[i]['id'];
          questionDetails['Question'] = allQuestions[i]['questionDescription'];
          questionDetails['Type'] = allQuestions[i]['type'];
          questionDetails['Option'] = allOptions;
        } else {
          questionDetails['QuestionId'] = allOptions[i]['id'];
          questionDetails['Question'] = allQuestions[i]['questionDescription'];
          questionDetails['Type'] = allQuestions[i]['type'];
        }
        result.push(questionDetails);
      }
      return result;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, updateQuestionDto: UpdateQuestionDto) {
    try {
      await Question.update(
        { questionDescription: updateQuestionDto.questionDescription },
        { where: { id: id } },
      );

      return 'Question Updated Successfully';
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  remove(id: number) {
    return `This action removes a #${id} question`;
  }
}
