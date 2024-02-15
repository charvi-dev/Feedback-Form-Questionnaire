import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { OptionService } from './option.service';
import { OptionDto } from './dto/option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';

@Controller('option')
export class OptionController {
  constructor(private readonly optionService: OptionService) {}

  @Post('/')
  create(@Body() OptionDto: OptionDto) {
    return this.optionService.create(OptionDto);
  }

  @Get('/:questionId')
  findAll(@Param('questionId') questionId: string) {
    return this.optionService.findAll(+questionId);
  }

  @Put('/:id')
  update(@Param('id') id: string, @Body() OptionDto: OptionDto) {
    return this.optionService.update(+id, OptionDto);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.optionService.remove(+id);
  }
}
