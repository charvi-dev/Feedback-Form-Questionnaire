import { Injectable } from '@nestjs/common';
import { OptionDto } from './dto/option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';

@Injectable()
export class OptionService {
  create(OptionDto: OptionDto) {
    return 'This action adds a new option';
  }

  findAll(questionId: number) {
    return `This action returns all option of a question`;
  }

  findOne(id: number) {
    return `This action returns a #${id} option`;
  }

  update(id: number, updateOptionDto: UpdateOptionDto) {
    return `This action updates a #${id} option`;
  }

  remove(id: number) {
    return `This action removes a #${id} option`;
  }
}
