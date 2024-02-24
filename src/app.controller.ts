import {
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UUID } from 'crypto';
import { FormService } from './modules/form/form.service';
import { QuestionService } from './modules/question/question.service';

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
      if(formData){
        result['Id'] = formData.id;
        result['Title'] = formData.title;
        result['Description'] = formData.description;
        result['status'] = formData.status;
        result['Questitons'] = await this.questionService.findAll(formData.id);
        return result;
      }else{
        return 'This link is not valid!'
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
