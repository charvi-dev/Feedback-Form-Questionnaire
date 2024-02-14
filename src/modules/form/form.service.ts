import { Injectable } from '@nestjs/common';
import { formDetailsDto} from './dto/formDetails.dto';
import { UpdateFormDto } from './dto/updateform.dto';

@Injectable()
export class FormService {
  create(formDetails: formDetailsDto) {
    return 'This action adds a new form';
  }

  findAll(userId:number) {
    return `This action returns all form created by that particular user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} form`;
  }
  updateStatus(id: number, updateFormDetails: UpdateFormDto) {
    return `This action updates a #${id} form status`;
    
  }

  update(id: number, updateFormDetails: UpdateFormDto) {
    return `This action updates a #${id} form`;
  }

  getFormLink(id:number){
    return 'this will return form link if published'
  }

  remove(id: number) {
    return `This action removes a #${id} form`;
  }
}
