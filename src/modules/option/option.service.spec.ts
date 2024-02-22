import { Test, TestingModule } from '@nestjs/testing';
import { OptionService } from './option.service';
import { UpdateOptionDto } from './dto/update-option.dto';
import { Option } from 'src/db/models/option.model';
import { InternalServerErrorException } from '@nestjs/common';

describe('OptionService', () => {
  let optionService: OptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OptionService],
    }).compile();

    optionService = module.get<OptionService>(OptionService);
  });

  describe('update', () => {
    it('should update the option with the provided ID', async () => {
      const id = 1;
      const updateOptionDto: UpdateOptionDto = {
        optionText: 'Updated Option Text',
      };

      jest.spyOn(Option, 'update').mockResolvedValue([1]);
      const result = await optionService.update(id, updateOptionDto);

      expect(Option.update).toHaveBeenCalledWith(
        { optionText: updateOptionDto.optionText },
        { where: { id } },
      );
      expect(result).toBe(`option of id ${id} is updated`);
    });

    it('should throw InternalServerErrorException on error', async () => {
      const id = 1;
      const updateOptionDto: UpdateOptionDto = {
        optionText: 'Updated Option Text',
      };
      const error = new Error('DB Error');
      jest.spyOn(Option, 'update').mockRejectedValue(error);

      await expect(optionService.update(id, updateOptionDto)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(Option.update).toHaveBeenCalledWith(
        { optionText: updateOptionDto.optionText },
        { where: { id } },
      );
    });
  });

  describe('remove', () => {
    it('should remove the option with the provided ID', async () => {
      const id = 1;

      jest.spyOn(Option, 'destroy').mockResolvedValue(1);
      const result = await optionService.remove(id);

      expect(Option.destroy).toHaveBeenCalledWith({ where: { id } });
      expect(result).toBe(` removed option of id  ${id}`);
    });

    it('should throw InternalServerErrorException on error', async () => {
      const id = 1;
      const error = new Error('DB Error');

      jest.spyOn(Option, 'destroy').mockRejectedValue(error);

      await expect(optionService.remove(id)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(Option.destroy).toHaveBeenCalledWith({ where: { id } });
    });
  });
});
