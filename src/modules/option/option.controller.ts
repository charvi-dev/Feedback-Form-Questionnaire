import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { OptionService } from './option.service';
import { OptionDto } from './dto/option.dto';
import { UserguardGuard } from '../user/userguard.guard';

@Controller('option')
@UseGuards(UserguardGuard)
export class OptionController {
  constructor(private readonly optionService: OptionService) {}

  @Put('/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() OptionDto: OptionDto) {
    return this.optionService.update(id, OptionDto);
  }

  @Delete('/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.optionService.remove(id);
  }
}
