import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { FormService } from './form.service';
import { formDetailsDto } from './dto/formDetails.dto';
import { UpdateFormDto } from './dto/updateform.dto';

@Controller('form')
export class FormController {
  constructor(private readonly formService: FormService) {}

  @Post('/')
  create(@Body() formDetails: formDetailsDto) {
    return this.formService.create(formDetails);
  }

  @Get('/:userId')
  findAll(@Param('userId') userId:number) {
    return this.formService.findAll(userId);
  }

  @Get('/:id/link')
  getFormLink(@Param('id') id:number){
    return this.formService.getFormLink(id)
  }

  @Put('/:id/:status')
  updateStatus(@Param('id') id:number,@Param('status') status: string, @Body() updateFormDto: UpdateFormDto) {
    return this.formService.updateStatus(+id, updateFormDto);
  }


  @Put('/:id')
  update(@Param('id') id: number, @Body() updateFormDto: UpdateFormDto) {
    return this.formService.update(+id, updateFormDto);
  }

  @Delete('/:id')
  remove(@Param('id') id: number) {
    return this.formService.remove(+id);
  }
}
