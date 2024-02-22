import { FormDetailsDto } from './formDetails.dto';
import { validate } from 'class-validator';

describe('FormDetailsDto', () => {
  it('should pass validation with valid data', async () => {
    const formData = new FormDetailsDto();
    formData.title = 'Valid Title';
    formData.userId = 1;
    formData.description = 'Valid description';
    formData.status = 'draft';
    formData.publishedDate = new Date();
    formData.closedDate = new Date();
    formData.link = 'valid-link';

    const errors = await validate(formData);
    expect(errors.length).toBe(0);
  });

  it('should fail validation with invalid data', async () => {
    const formData = new FormDetailsDto();
    formData.title = '';
    formData.userId = -1;
    formData.description = 'Too short';
    formData.status = 'invalid';
    formData.publishedDate = new Date('invalid');
    formData.closedDate = new Date();
    formData.link = '';

    const errors = await validate(formData);
    expect(errors.length).toBeGreaterThan(0);
  });
});
