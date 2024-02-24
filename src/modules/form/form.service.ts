import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Form } from 'src/db/models/form.model';
import { v4 as uuidv4 } from 'uuid';
import { FormDetailsDto } from './dto/formDetails.dto';
import { UpdateFormDto } from './dto/updateForm.dto';
import { STATUS } from 'src/constants';
import { link } from 'fs';
import { Submission } from 'src/db/models/submission.model';

@Injectable()
export class FormService {
  async create(formDetails: FormDetailsDto) {
    const data = {
      title: formDetails.title,
      description: formDetails.description,
      userId: formDetails.userId,
      status: STATUS.DRAFT,
    };
    try {
      const res = await Form.create(data);
      return res;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(userId: number) {
    try {
      const res = await Form.findAll({
        where: { userId: userId },
        order: [['id', 'ASC']],
      });
      const formsWithSubmissionCount = await Promise.all(
        res.map(async (form) => {
          const totalSubmission = await Submission.count({
            where: { formId: form.id },
          });
          return { ...form["dataValues"], totalSubmission };
        }),
      );
      return formsWithSubmissionCount;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findbyLink(uuid: uuidv4) {
    try {
      const res = await Form.findOne({ where: { link: uuid } });
      return res;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateStatus(id: number, status: string) {
    try {
      const prevStatus: string = (await Form.findByPk(id)).status;

      if (prevStatus === STATUS.DRAFT && status === STATUS.PUBLISHED) {
        await Form.update(
          {
            status,
            publishedDate: new Date(),
            closedDate: null,
            link: uuidv4(),
          },
          { where: { id } },
        );
      } else if (status === STATUS.DRAFT) {
        await Form.update(
          { status, publishedDate: null, closedDate: null, link: null },
          { where: { id } },
        );
      } else if (prevStatus === STATUS.PUBLISHED && status == STATUS.CLOSED) {
        await Form.update(
          { status, closedDate: new Date(), link: null },
          { where: { id } },
        );
      } else {
        return 'You can publish only draft form and can close only published form';
      }
      if (status === STATUS.PUBLISHED) {
        const res = await Form.findByPk(id);
        return `http://localhost:${process.env.PORT}/${res.link}`;
      } else {
        return 'status changed!';
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: number, updateFormDetails: UpdateFormDto) {
    try {
      const formStoredData = await Form.findByPk(id);
      if (formStoredData) {
        const updatedData = {
          title: updateFormDetails.title ?? formStoredData.title,
          description:
            updateFormDetails.description ?? formStoredData.description,
        };
        await Form.update(updatedData, { where: { id: id } });
        return `Form with id ${id} updated successfully`;
      } else {
        throw new NotFoundException();
      }
    } catch (error) {
      if (error['message'] === 'Not Found') {
        throw new NotFoundException(`Form with id ${id} not found!`);
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async getFormLink(formId: number) {
    try {
      const form = await Form.findByPk(formId);
      if (form.link) {
        return `http://localhost:${process.env.PORT}/${form.link}`;
      } else {
        return `Form Link of id ${formId} is not available!`;
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: number) {
    try {
      await Form.destroy({ where: { id: id } });
      return `Form of id ${id} is deleted!`;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
