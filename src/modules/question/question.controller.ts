import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionDto } from './dto/question.dto';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post('/')
  create(@Body() QuestionDetails: QuestionDto) {
    return this.questionService.create(QuestionDetails);
  }

  @Get('/:formId')
  findAll(@Param('formId') formId: number) {
    return this.questionService.findAll(formId);
  }

  @Put('/:id')
  update(@Param('id') id: string, @Body() updatedDetails: QuestionDto) {
    return this.questionService.update(+id, updatedDetails);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.questionService.remove(+id);
  }
}
