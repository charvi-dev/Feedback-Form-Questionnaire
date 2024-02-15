import { IsEnum, IsInt, Length } from 'class-validator';

export class formDetailsDto {
  @Length(5, 255)
  title: string;

  @IsInt()
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
