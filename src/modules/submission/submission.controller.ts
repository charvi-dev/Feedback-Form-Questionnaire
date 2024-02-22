import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { CreateSubmissionDto } from './dto/create.submission.dto';
import { UserguardGuard } from '../user/userguard/user.guard';

@Controller('submission')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @Post()
  create(@Body() createSubmissionDto: CreateSubmissionDto) {
    return this.submissionService.create(createSubmissionDto);
  }

  @Get('/:formId')
  @UseGuards(UserguardGuard)
  findAll(@Param('formId', ParseIntPipe) formId: number) {
    return this.submissionService.findAll(formId);
  }
}
