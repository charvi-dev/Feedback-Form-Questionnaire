import { UpdateOptionDto } from './update-option.dto';
import { OptionDto } from './option.dto';

describe('UpdateOptionDto', () => {
  it('should extend OptionDto', () => {
    const updateOptionDto = new UpdateOptionDto();
    const optionDtoProperties = Object.getOwnPropertyNames(new OptionDto());
    const updateOptionDtoProperties = Object.getOwnPropertyNames(updateOptionDto);

    expect(updateOptionDtoProperties).toEqual(expect.arrayContaining(optionDtoProperties));
  });
});
