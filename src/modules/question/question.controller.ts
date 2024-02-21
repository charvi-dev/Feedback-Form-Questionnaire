import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ValidationPipe,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionDto } from './dto/question.dto';
import { UserguardGuard } from '../user/user.guard';

@Controller('question')
@UseGuards(UserguardGuard)
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post('/')
  addQuestion(@Body(new ValidationPipe()) QuestionDetails: QuestionDto) {
    return this.questionService.addQuestion(QuestionDetails);
  }

  @Get('/all')
  findAll(@Query('formId', ParseIntPipe) formId: number) {
    return this.questionService.findAll(formId);
  }

  @Put('/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedDetails: QuestionDto,
  ) {
    return this.questionService.update(id, updatedDetails);
  }

  @Delete('/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.questionService.remove(id);
  }
}
