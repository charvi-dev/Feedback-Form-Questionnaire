import { PartialType } from '@nestjs/mapped-types';
import { formDetailsDto } from './formDetails.dto';

export class UpdateFormDto extends PartialType(formDetailsDto) {
    title: string;
    description: string;
    status: 'draft' | 'published' | 'closed';
}
