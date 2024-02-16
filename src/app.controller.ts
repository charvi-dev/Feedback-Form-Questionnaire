import {
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FormService } from './modules/form/form.service';
import { QuestionService } from './modules/question/question.service';
import { UUID } from 'crypto';

@Controller()
export class AppController {
  constructor(
    private readonly formService: FormService,
    private readonly questionService: QuestionService,
  ) {}

  @Get('/:uuid')
  async showForm(@Param('uuid', ParseUUIDPipe) uuid: UUID) {
    try {
      let result = {};
      let formData = await this.formService.findbyLink(uuid);
      result['Id']=formData.id;
      result['Title'] = formData.title;
      result['Description'] = formData.description;
      result['status'] = formData.status;
      result['Questitons'] = await this.questionService.findAll(formData.id);
      if(result['status']==='draft'){
        return "Form Not Published!";
      }else if(result['status']==='closed'){
        return "Form is not accepting any responses now!"
      }
      else{
        return result;
      }
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
