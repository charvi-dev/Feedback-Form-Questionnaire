import { PartialType } from '@nestjs/mapped-types';
import { OptionDto } from './option.dto';

export class UpdateOptionDto extends PartialType(OptionDto) {}
