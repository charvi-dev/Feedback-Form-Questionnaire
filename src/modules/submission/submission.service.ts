import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubmissionDto } from './dto/create.submission.dto';
import { Submission } from 'src/db/models/submission.model';
import { Form } from 'src/db/models/form.model';
import { Question } from 'src/db/models/question.model';

@Injectable()
export class SubmissionService {

  async create(createSubmissionDto: CreateSubmissionDto) {
    try {
      const formExists = await Form.findByPk(createSubmissionDto.formId);
      if (!formExists) {
        throw new BadRequestException('Form with the provided ID does not exist.');
      }

      const res = await Submission.create({
        formId: createSubmissionDto.formId,
        submissionDate:new Date(),
        formResponse: createSubmissionDto.formResponse
      })
      return res;
    } catch (error) {
      throw new BadRequestException(error)
    }

  }



  async formatSubmission(formResponse: any[]) {
    return Promise.all(formResponse.map(async response => {
      const question = await Question.findByPk(response.questionId);
      return {
        questionId: question.id,
        text: question.questionDescription,
        response: response.response
      };
    }));
  }

  async formatSubmissionData(submission: Submission) {
    return {
      submissionId: submission.id,
      formId: submission.formId,
      submittedOn:submission.submissionDate,
      questions: await this.formatSubmission(submission.formResponse)
    };
  }

  async findAll(formId: number) {
    try {
      const submissions = await Submission.findAll({
        where: { formId: formId },
      });

      return Promise.all(submissions.map(submission => this.formatSubmissionData(submission)));
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async findByPk(formId: number, submissionId: number) {
    try {
      const submission = await Submission.findOne({
        where: { formId: formId, id: submissionId },
      });

     

      return this.formatSubmissionData(submission);
    } catch (error) {
      throw new BadRequestException();
    }
  }

}
