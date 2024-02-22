import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubmissionDto } from './dto/create.submission.dto';
import { Submission } from 'src/db/models/submission.model';
import { Form } from 'src/db/models/form.model';
import { Question } from 'src/db/models/question.model';
import { QUESTION_TYPE } from 'src/constants';

@Injectable()
export class SubmissionService {

  private async validateSubmission(formResponse) {
    try {
     await Promise.all(formResponse.map(async (response) => {
       const question = await Question.findByPk(response["questionId"]);
       const type = question["type"];
       const length = response["response"].length;
       const userResponse = response["response"];
 
       if (type === QUESTION_TYPE.SINGLE_LINE && length > 200) {
         throw new Error(`char limit for single line is 200 for questionId:${question["id"]}`)
       }
 
       if (type === QUESTION_TYPE.MULTIPLE_LINE && length > 500) {
         throw new Error(`char limit for multiple line is 500 for questionId:${question["id"]}`)
       }
       if(type===QUESTION_TYPE.RATING ){
        if(userResponse<=0 || userResponse>5){
          throw new Error(`Please rate on a scale of 1 to 5 for questionId:${question["id"]}`)
        }
       }
       if(type==QUESTION_TYPE.RANKING){
        if(userResponse<=0 || userResponse>10){
          throw new Error(`Please rank on a scale of 1 to 10 for for questionId:${question["id"]}`)
        }
       }
       if(type==QUESTION_TYPE.SINGLE_CHOICE && length>1){
        throw new Error(`Only single choice allowed for questionId:${question["id"]}`)
       }
 
     }));
    } catch (error) {
       throw new BadRequestException(error);
    }
 }


  async create(createSubmissionDto: CreateSubmissionDto) {
    try {
      const formExists = await Form.findByPk(createSubmissionDto.formId);
      if (!formExists) {
        throw new BadRequestException(
          'Form with the provided ID does not exist.',
        );
      }
      await this.validateSubmission(createSubmissionDto.formResponse);
      const res = await Submission.create({
        formId: createSubmissionDto.formId,
        submissionDate: new Date(),
        formResponse: createSubmissionDto.formResponse,
      });
      return res;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async formatSubmission(formResponse: any[]) {
    return Promise.all(
      formResponse.map(async (response) => {
        const question = await Question.findByPk(response.questionId);
        return {
          questionId: question.id,
          text: question.questionDescription,
          response: response.response,
        };
      }),
    );
  }

  async formatSubmissionData(submission: Submission) {
    return {
      submissionId: submission.id,
      formId: submission.formId,
      submittedOn: submission.submissionDate,
      questions: await this.formatSubmission(submission.formResponse),
    };
  }

  async findAll(formId: number) {
    try {
      const submissions = await Submission.findAll({
        where: { formId: formId },
      });

      return Promise.all(
        submissions.map((submission) => this.formatSubmissionData(submission)),
      );
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async findByPk(formId: number, submissionId: number) {
    try {
      const submission = await Submission.findOne({
        where: { formId: formId, id: submissionId },
      });
      if (!submission) {
        throw new BadRequestException('Submission not found');
      }

      return this.formatSubmissionData(submission);
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
