import { PartialType } from '@nestjs/mapped-types';
import { userDetails } from './userDetails.dto';

export class UpdateUserDto extends PartialType(userDetails) {}
