import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ValidationPipe,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FormService } from './form.service';
import { formDetailsDto } from './dto/formDetails.dto';
import { UpdateFormDto } from './dto/updateform.dto';
import { UserguardGuard } from '../user/userguard.guard';

@Controller('form')
@UseGuards(UserguardGuard)
export class FormController {
  constructor(private readonly formService: FormService) {}

  @Post('/')
  create(@Body(new ValidationPipe()) formDetails: formDetailsDto) {
    return this.formService.create(formDetails);
  }

  @Get('/')
  findAll(@Query('userId') userId: number) {
    return this.formService.findAll(userId);
  }

  @Get('/link')
  getFormLink(@Query('formId') formId: number) {
    return this.formService.getFormLink(formId);
  }

  @Put(':id/updateStatus')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updateFormDetails: UpdateFormDto,
  ) {
    return this.formService.updateStatus(id, updateFormDetails.status);
  }

  @Put('/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updateFormDetails: UpdateFormDto,
  ) {
    return this.formService.update(id, updateFormDetails);
  }

  @Delete('/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.formService.remove(id);
  }
}
