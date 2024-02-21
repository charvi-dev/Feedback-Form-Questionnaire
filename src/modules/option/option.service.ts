import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdateOptionDto } from './dto/update-option.dto';
import { Option } from 'src/db/models/option.model';

@Injectable()
export class OptionService {
  async update(id: number, updateOptionDto: UpdateOptionDto) {
    try {
      await Option.update(
        { optionText: updateOptionDto.optionText },
        { where: { id: id } },
      );
      return `option of id ${id} is updated`;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number) {
    try {
      await Option.destroy({ where: { id } });
      return ` removed option of id  ${id}`;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
