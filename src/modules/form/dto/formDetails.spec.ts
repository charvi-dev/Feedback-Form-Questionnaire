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
    formData.title = ''; // Invalid: Title is too short
    formData.userId = -1; // Invalid: Negative user ID
    formData.description = 'Too short'; // Invalid: Description is too short
    formData.status = 'invalid'; // Invalid: Status is not one of the allowed values
    formData.publishedDate = new Date('invalid'); // Invalid: Invalid date format
    formData.closedDate = new Date(); // Valid: Date can be null
    formData.link = ''; // Invalid: Link is empty

    const errors = await validate(formData);
    expect(errors.length).toBeGreaterThan(0);
  });
});
