import { CreateSubmissionDto } from './create.submission.dto';

describe('CreateSubmissionDto', () => {
  it('should create a submission DTO object', () => {
    const formId = 1;
    const submissionDate = new Date();
    const formResponse = { exampleField: 'exampleValue' };

    const submissionDto = new CreateSubmissionDto();
    submissionDto.formId = formId;
    submissionDto.submissionDate = submissionDate;
    submissionDto.formResponse = formResponse;

    expect(submissionDto.formId).toBe(formId);
    expect(submissionDto.submissionDate).toBe(submissionDate);
    expect(submissionDto.formResponse).toEqual(formResponse);
  });
});
