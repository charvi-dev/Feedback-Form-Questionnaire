import { UpdateFormDto } from './updateform.dto';

describe('UpdateFormDto', () => {
  it('should create an instance', () => {
    const updateFormDto = new UpdateFormDto();
    expect(updateFormDto).toBeDefined();
  });

  it('should allow properties to be optional', () => {
    const updateFormDto = new UpdateFormDto();
    expect(updateFormDto.title).toBeUndefined();
    expect(updateFormDto.description).toBeUndefined();
    expect(updateFormDto.status).toBeUndefined();
    expect(updateFormDto.publishedDate).toBeUndefined();
    expect(updateFormDto.closedDate).toBeUndefined();
    expect(updateFormDto.link).toBeUndefined();
  });
});
