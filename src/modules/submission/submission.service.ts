import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { Submission} from 'src/db/models/submission.model';
import { Form } from 'src/db/models/form.model';
import { Question } from 'src/db/models/question.model';
 
@Injectable()
export class SubmissionService {
 
 async create(createSubmissionDto: CreateSubmissionDto) {
     try{
      const formExists = await Form.findByPk(createSubmissionDto.formId);
      if (formExists===null) {
        throw new BadRequestException('Form with the provided ID does not exist.');
      }
      const res = await Submission.create({
        formId:createSubmissionDto.formId,
        submissionDate:new Date(),
        formResponse:createSubmissionDto.formResponse
      })
      return res ;
    } catch(error){
      throw new BadRequestException()
    }
     
  }
 
 
  async findAll(formId: number) {
    try {
      const submissions = await Submission.findAll({
        where: { formId: formId },
      });
  
      const formattedData = await Promise.all(submissions.map(async submission => ({
        submissionId: submission.id,
        formId: submission.formId,
         questions: await Promise.all(submission.formResponse.map(async response => {
          const question = await Question.findByPk(response.questionId);
          return {
            questionId: question.id,
            text: question.questionDescription,
            response: response.response,
            submittedOn:submission.submissionDate
          };
        }))
      })));
  
      return formattedData;
    } catch (error) {
        throw new Error("Failed to fetch submissions");
    }
  }
}
 