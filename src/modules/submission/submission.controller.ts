import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';

@Controller('submission')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Post()
  create(@Body() createSubmissionDto: CreateSubmissionDto) {
    return this.submissionService.create(createSubmissionDto);
  }

  @Get('/:formId')
  
  findAll(@Param('formId') formId: string) {
    return this.submissionService.findAll(+formId);
  }
  @Get(':formId/submissions/:submissionId')
  
  findByPk(@Param('formId') formId: string,@Param('submissionId') submissionId:string) {
    return this.submissionService.findByPk(+formId,+submissionId);
  }

  
}
