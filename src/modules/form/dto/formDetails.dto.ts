<<<<<<< HEAD
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

=======
export class formDetailsDto {
  title: string;
  userId: number;
  description: string;
  status: string;
  publishedDate: Date;
  closeDate: Date;
>>>>>>> 66ccde65a0b0071f50b4223793813f2b27ff2ccf
  link: string;
}
