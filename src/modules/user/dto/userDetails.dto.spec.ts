import { validate } from 'class-validator';
import { userDetails } from './userDetails.dto';

describe('userDetails', () => {
  it('should validate a userDetails instance with valid data', async () => {
    const validUserDetails = new userDetails();
    validUserDetails.userName = 'Charvi';
    validUserDetails.password = 'Charvi@3107';

    const errors = await validate(validUserDetails);

    expect(errors.length).toBe(0);
  });

  it('should fail to validate a userDetails instance with invalid data', async () => {
    const invalidUserDetails = new userDetails();
    invalidUserDetails.userName = 'a';
    invalidUserDetails.password = 'short';

    const errors = await validate(invalidUserDetails);

    expect(errors.length).toBe(2);

    expect(errors[0].constraints).toHaveProperty('isLength');
    expect(errors[0].constraints['isLength']).toBe(
      'userName must be longer than or equal to 3 characters',
    );

    expect(errors[1].constraints).toHaveProperty('isLength');
    expect(errors[1].constraints['isLength']).toBe(
      'password must be longer than or equal to 6 characters',
    );
  });
});
