export const STATUS = {
  PUBLISHED: 'published',
  DRAFT: 'draft',
  CLOSED: 'closed',
} as const;

export const QUESTION_TYPE = {
  SINGLE_CHOICE: 'single chocie',
  MULTIPLE_CHOICE: 'multiple choice',
  SINGLE_LINE: 'single-line answer',
  MULTIPLE_LINE: 'multiple-line answer',
} as const;
