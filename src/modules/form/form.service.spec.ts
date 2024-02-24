import { FormService } from './form.service';
import { FormDetailsDto } from './dto/formDetails.dto';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { STATUS } from 'src/constants';
import { Form } from 'src/db/models/form.model';
import { Submission } from 'src/db/models/submission.model';
import { title } from 'process';



jest.mock('src/db/models/form.model', () => ({
  Form: {
    findOne: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findByPk: jest.fn(),
    destroy: jest.fn(),
  },
}));

jest.mock('src/db/models/submission.model',()=>({
  Submission:{
    count:jest.fn()
  }
}))

describe('Form Service', () => {
  let service: FormService;

  const input: FormDetailsDto = {
    title: "Student Detail's",
    description:
      'This form is for collecting student details for testing purpose',
    userId: 1,
    status:STATUS.DRAFT,
    closedDate:null,
    link:null,
    publishedDate:null
  };

  const output = {
    id: 1,
    title: 'my nice title',
    userId: 1,
    description: 'This is going to the best desc',
    status: STATUS.PUBLISHED,
    publishedDate: null,
    closedDate: null,
    link: '5e77af7d-212d-4cb2-9fdb-f60c891fefcd',
    createdAt: '2024-02-16T16:37:43.026Z',
    updatedAt: '2024-02-16T17:11:49.659Z',
  };

  beforeEach(() => {
    service = new FormService();
    (Form.update as jest.Mock).mockClear();
  });

  it('create', async () => {
    (Form.create as jest.Mock).mockResolvedValue(output);
    const result = await service.create(input);
    expect(result).toBe(output);
  });

  it('create should throw exception when error is found', async () => {
    (Form.create as jest.Mock).mockRejectedValue('DB Error');
    try {
      await service.create(input);
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerErrorException);
    }
  });

  it('findAll', async () => {
    (Form.findAll as jest.Mock).mockResolvedValue([{}]);
    (Submission.count as jest.Mock).mockResolvedValue(1);
    const result = await service.findAll(1);
    expect(result).toEqual([{totalSubmission:1}]);
    expect(Form.findAll).toHaveBeenCalledWith({
      where: { userId: 1 },
      order: [['id', 'ASC']],
    });
  });

  it('findAll Exception', async () => {
    (Form.findAll as jest.Mock).mockRejectedValue('DB Error');
    try {
      await service.findAll(1);
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerErrorException);
    }
  });

  it('findbyLink should return form data when found', async () => {
    (Form.findOne as jest.Mock).mockResolvedValue(output);
    const link: uuidv4 = '5e77af7d-212d-4cb2-9fdb-f60c891fefcd';
    const result = await service.findbyLink(link);
    expect(result).toEqual(output);
    expect(Form.findOne).toHaveBeenCalledWith({ where: { link } });
  });

  it('findbyLink should return null when no form is found', async () => {
    (Form.findOne as jest.Mock).mockResolvedValue(null);
    const link: uuidv4 = 'non-existent-link';
    const result = await service.findbyLink(link);
    expect(result).toBeNull();
    expect(Form.findOne).toHaveBeenCalledWith({ where: { link } });
  });

  it('findbyLink should throw exception', async () => {
    (Form.findOne as jest.Mock).mockRejectedValue('DB Error');
    const link: uuidv4 = 'non-existent-link';
    try {
      await service.findbyLink(link);
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerErrorException);
    }
  });

  it('updateStatus should update status to "published"', async () => {
    const id = 1;
    const status = STATUS.PUBLISHED;
    const mockForm = {
      link: '5e77af7d-212d-4cb2-9fdb-f60c891fefcd',
    };

    (Form.update as jest.Mock).mockResolvedValue(true);
    (Form.findByPk as jest.Mock).mockResolvedValue({status:STATUS.DRAFT,link:mockForm.link});

    const result = await service.updateStatus(id, status);

    expect(Form.update).toHaveBeenCalledWith(
      {
        status,
        publishedDate: expect.any(Date),
        closedDate: null,
        link: expect.any(String),
      },
      { where: { id } },
    );
    expect(result).toEqual(
      `http://localhost:${process.env.PORT}/${mockForm.link}`,
    );
  });


  it('updateStatus should update status to "draft"', async () => {
    const id = 1;
    const status = STATUS.DRAFT;

    (Form.update as jest.Mock).mockResolvedValue(true);

    const result = await service.updateStatus(id, status);

    expect(Form.update).toHaveBeenCalledWith(
      { status, publishedDate: null, closedDate: null,link:null },
      { where: { id } },
    );
    expect(result).toEqual('status changed!');
  });

  it('updateStatus should update status to "closed"', async () => {
    const id = 1;
    const status = STATUS.CLOSED;
    (Form.findByPk as jest.Mock).mockResolvedValue({status:STATUS.PUBLISHED});
    (Form.update as jest.Mock).mockResolvedValue(true);

    const result = await service.updateStatus(id, status);

    expect(Form.update).toHaveBeenCalledWith(
      { status, closedDate: expect.any(Date), link: null },
      { where: { id } },
    );
    expect(result).toEqual('status changed!');
  });


  it('updateStatus should throw InternalServerErrorException on error', async () => {
    const id = 1;
    const status = STATUS.PUBLISHED;
    (Form.update as jest.Mock).mockRejectedValue('DB Error');
    try {
      await service.updateStatus(id, status);
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerErrorException);
    }
  });

  it('update should update the form when it exists', async () => {
    const id = 1;

    const updateFormDetails = {
      title: 'Updated Title',
      description: 'Updated Description',
    };

    const mockForm = {
      id: 1,
      title: 'Old Title',
      description: 'Old Description',
    };

    (Form.findByPk as jest.Mock).mockResolvedValue(mockForm);

    (Form.update as jest.Mock).mockResolvedValue(true);

    const result = await service.update(id, updateFormDetails);

    expect(Form.findByPk).toHaveBeenCalledWith(id);
    expect(Form.update).toHaveBeenCalledWith(updateFormDetails, {
      where: { id },
    });
    expect(result).toEqual(`Form with id ${id} updated successfully`);
  });

  it('update should throw NotFoundException when form does not exist', async () => {
    const id = 1;
    const updateFormDetails = {
      title: 'Updated Title',
      description: 'Updated Description',
    };

    (Form.findByPk as jest.Mock).mockResolvedValue(null);

    try {
      await service.update(id, updateFormDetails);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }
    expect(Form.findByPk).toHaveBeenCalledWith(id);
    expect(Form.update).not.toHaveBeenCalled();
  });

  it('update should throw InternalServerErrorException on error', async () => {
    const id = 1;
    const updateFormDetails = {
      title: 'Updated Title',
      description: 'Updated Description',
    };
    (Form.findByPk as jest.Mock).mockRejectedValue('DB Error');

    try {
      await service.update(id, updateFormDetails);
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerErrorException);
    }

    expect(Form.findByPk).toHaveBeenCalledWith(id);
    expect(Form.update).not.toHaveBeenCalled();
  });

  it('getFormLink should return the form link when it exists', async () => {
    const formId = 1;
    const mockForm = {
      id: 1,
      link: '5e77af7d-212d-4cb2-9fdb-f60c891fefcd',
    };

    (Form.findByPk as jest.Mock).mockResolvedValue(mockForm);

    const result = await service.getFormLink(formId);

    expect(Form.findByPk).toHaveBeenCalledWith(formId);
    expect(result).toEqual(
      `http://localhost:${process.env.PORT}/${mockForm.link}`,
    );
  });

  it('getFormLink should return a message when form link is not available', async () => {
    const formId = 1;
    const mockForm = {
      id: 1,
      link: null,
    };
    (Form.findByPk as jest.Mock).mockResolvedValue(mockForm);

    const result = await service.getFormLink(formId);

    expect(Form.findByPk).toHaveBeenCalledWith(formId);
    expect(result).toEqual(`Form Link of id ${formId} is not available!`);
  });

  it('getFormLink should throw InternalServerErrorException on error', async () => {
    const formId = 1;
    (Form.findByPk as jest.Mock).mockRejectedValue('DB Error');
    try {
      await service.getFormLink(formId);
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerErrorException);
    }
    expect(Form.findByPk).toHaveBeenCalledWith(formId);
  });

  it('remove should delete the form with the provided ID', async () => {
    const id = 1;
    (Form.destroy as jest.Mock).mockResolvedValue(1);

    const result = await service.remove(id);

    expect(Form.destroy).toHaveBeenCalledWith({ where: { id } });
    expect(result).toEqual(`Form of id ${id} is deleted!`);
  });

  it('remove should throw InternalServerErrorException on error', async () => {
    const id = 1;
    (Form.destroy as jest.Mock).mockRejectedValue('DB Error');
    try {
      await service.remove(id);
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerErrorException);
    }
    expect(Form.destroy).toHaveBeenCalledWith({ where: { id } });
  });
});
