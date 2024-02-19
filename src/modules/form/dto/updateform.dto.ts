import { PartialType } from '@nestjs/mapped-types';
import { FormDetailsDto } from './formDetails.dto';

export class UpdateFormDto extends PartialType(FormDetailsDto) {}
