export const STATUS = {
  PUBLISHED: 'published',
  DRAFT: 'draft',
  CLOSED: 'closed',
} as const;

export const QUESTION_TYPE = {
  SINGLE_CHOICE: 'single choice',
  MULTIPLE_CHOICE: 'multiple choice',
  SINGLE_LINE: 'single-line answer',
  MULTIPLE_LINE: 'multiple-line answer',
  RATING:'rating',
  RANKING:'ranking'
} as const;
