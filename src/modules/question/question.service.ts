import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { QuestionDto } from './dto/question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from 'src/db/models/question.model';
import { Option } from 'src/db/models/option.model';
import { QUESTION_TYPE } from 'src/constants';

@Injectable()
export class QuestionService {
  async addQuestion(questionDetails: QuestionDto) {
    const data = {
      formId: questionDetails.formId,
      questionDescription: questionDetails.questionDescription,
      type: questionDetails.type,
    };
    try {
      if (
        data.type === QUESTION_TYPE.MULTIPLE_CHOICE ||
        data.type === QUESTION_TYPE.SINGLE_CHOICE
      ) {
        if (questionDetails.optionList && questionDetails.optionList.length) {
          const question = await Question.create(data);
          questionDetails.optionList.forEach(async (option) => {
            await Option.create({
              questionId: question.id,
              optionText: option,
            });
          });
        } else {
          return 'Option List should be given for multiple and single choice';
        }
      } else {
        await Question.create(data);
      }
      return 'Question added successfully';
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(formId: number) {
    try {
      let result = [];
      let allQuestions = await Question.findAll({
        where: { formId: formId },
        order: [['id', 'ASC']],
      });

      for (let i = 0; i < allQuestions.length; i++) {
        let allOptions = null;

        if (
          allQuestions[i]['type'] === QUESTION_TYPE.MULTIPLE_CHOICE ||
          allQuestions[i]['type'] === QUESTION_TYPE.SINGLE_CHOICE
        ) {
          allOptions = await Option.findAll({
            where: { questionId: allQuestions[i]['id'] },
            attributes: ['id', 'optionText'],
          });
        }

        let questionDetails = {};
        if (allOptions) {
          questionDetails['QuestionId'] = allQuestions[i]['id'];
          questionDetails['Question'] = allQuestions[i]['questionDescription'];
          questionDetails['Type'] = allQuestions[i]['type'];
          questionDetails['Option'] = allOptions;
        } else {
          questionDetails['QuestionId'] = allQuestions[i]['id'];
          questionDetails['Question'] = allQuestions[i]['questionDescription'];
          questionDetails['Type'] = allQuestions[i]['type'];
        }
        result.push(questionDetails);
      }
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error);
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
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: number) {
    try {
      await Question.destroy({ where: { id: id } });
      return `Question of Id ${id} is deleted!`;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
