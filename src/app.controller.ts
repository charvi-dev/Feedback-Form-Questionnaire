import {
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FormService } from './modules/form/form.service';
import { QuestionService } from './modules/question/question.service';

@Controller()
export class AppController {
  constructor(
    private readonly formService: FormService,
    private readonly questionService: QuestionService,
  ) {}

  @Get('/:id')
  async showForm(@Param('id', ParseIntPipe) id: number) {
    try {
      let result = {};
      let formData = await this.formService.findOne(id);
      result['Title'] = formData.title;
      result['Description'] = formData.description;
      result['status'] = formData.status;
      result['Questitons'] = await this.questionService.findAll(id);
      return result;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
