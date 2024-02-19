import { Form } from 'src/db/models/form.model';
import { FormService } from './form.service';
import { FormDetailsDto } from './dto/formDetails.dto';
import { InternalServerErrorException } from '@nestjs/common';
import { where } from 'sequelize';

describe('Form Service', () => {
  let service: FormService;

  const input: FormDetailsDto = {
    title: "Student Detail's",
    description:
      'This form is for collecting student details for testing purpose',
    status: 'draft',
    userId: 1,
    closedDate: null,
    publishedDate: null,
    link: null,
  };

  const output= {
    id: 1,
    title: 'my nice title',
    userId: 1,
    description: 'This is going to the best desc',
    status: 'published',
    publishedDate: null,
    closedDate: null,
    link: '5e77af7d-212d-4cb2-9fdb-f60c891fefcd',
    createdAt: '2024-02-16T16:37:43.026Z',
    updatedAt: '2024-02-16T17:11:49.659Z',
  };

  beforeEach(() => {
    service = new FormService();
  });

  it('create', async () => {
    jest.spyOn(Form, 'create').mockResolvedValue(output);
    const result = await service.create(input);
    expect(result).toBe(output);
  });

  it('create Exception', async () => {
    jest.spyOn(Form, 'create').mockRejectedValue('DB Error');
    try {
      await service.create(input);
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerErrorException);
    }
  });

  it('findAll', async () => {
    jest.spyOn(Form, 'findAll').mockResolvedValue([]);
    const result = await service.findAll(1);
    expect(result).toEqual([]);
    expect(Form.findAll).toHaveBeenCalledWith({
      where: { userId: 1 },
      order: [['id', 'ASC']],
    });
  });

  it('findAll Exception', async () => {
    jest.spyOn(Form, 'findAll').mockRejectedValue('DB Error');
    try {
      await service.findAll(1);
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerErrorException);
    }
  });

  it('findByLink', () => {
    // jest.spyOn(Form,'findOne').mockResolvedValue(output)
  });
});
