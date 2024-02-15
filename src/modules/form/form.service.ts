import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { formDetailsDto } from './dto/formDetails.dto';
import { UpdateFormDto } from './dto/updateform.dto';
import { Form } from 'src/db/models/form.model';

@Injectable()
export class FormService {
  async create(formDetails: formDetailsDto) {
    const data = {
      title: formDetails.title,
      description: formDetails.description,
      userId: formDetails.userId,
      status: 'draft',
    };
    try {
      const res = await Form.create(data);
      return res;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findAll(userId: number) {
    try {
      const res = await Form.findAll({ where: { userId: userId } });
      return res;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} form`;
  }

  async updateStatus(id: number, status: string) {
    try {
      if (status == 'published') {
        await Form.update(
          { status, publishedDate: new Date(), closedDate: null },
          { where: { id } },
        );
      } else if (status == 'draft') {
        await Form.update(
          { status, publishedDate: null, closedDate: null },
          { where: { id } },
        );
      } else if (status == 'closed') {
        await Form.update(
          { status, closedDate: new Date() },
          { where: { id } },
        );
      }
      return 'status changed!';
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, updateFormDetails: UpdateFormDto) {
    try {
      const formStoredData = await Form.findByPk(id);
      if (formStoredData) {
        const updatedData = {
          title: updateFormDetails.title
            ? updateFormDetails.title
            : formStoredData.title,
          description: updateFormDetails.description
            ? updateFormDetails.description
            : formStoredData.description,
        };
        const result = await Form.update(updatedData, { where: { id: id } });
        return `Form with id ${id} updated successfully`;
      } else {
        throw new NotFoundException();
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getFormLink(formId: number) {
    try {
      const form = await Form.findByPk(formId);
      if (form.link) {
        return form.link;
      } else {
        return `Form of id ${formId} is not published!`;
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number) {
    try {
      await Form.destroy({ where: { id: id } });
      return `Form of id ${id} is deleted!`;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
