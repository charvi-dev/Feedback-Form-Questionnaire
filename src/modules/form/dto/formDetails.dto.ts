import { IsEnum, Length } from 'class-validator';

export class FormDetailsDto {
  @Length(5, 255)
  title: string;

  userId: number;

  @Length(10, 255)
  description: string;

  @IsEnum(['draft', 'published', 'closed'], {
    message: 'message status can be darft,published or closed',
  })
  status: string;

  publishedDate: Date;

  closedDate: Date;

  link: string;
}
