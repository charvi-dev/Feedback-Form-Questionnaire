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
  Req,
} from '@nestjs/common';
import { FormService } from './form.service';
import { FormDetailsDto } from './dto/formDetails.dto';
import { UpdateFormDto } from './dto/updateform.dto';
import { UserguardGuard } from '../user/userguard.guard';

@Controller('form')
@UseGuards(UserguardGuard)
export class FormController {
  constructor(private readonly formService: FormService) {}

  @Put('/updateStatus/:id')
  updateStatus(
    @Body(new ValidationPipe()) updateFormDetails: UpdateFormDto,
    @Param('id',ParseIntPipe) id:number
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

  @Post('/')
  create(@Body(new ValidationPipe()) formDetails: FormDetailsDto,@Req() req:Request) {
    formDetails.userId=req.body["user"]["id"];
    return this.formService.create(formDetails);
  }

  @Get('/getAll')
  findAll(@Req() req:Request) {
    return this.formService.findAll(req.body["user"]["id"])
  }

  @Get('/link')
  getFormLink(@Query('formId') formId: number) {
    return this.formService.getFormLink(formId);
  }
}
