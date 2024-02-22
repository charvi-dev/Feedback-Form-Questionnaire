import { Test, TestingModule } from '@nestjs/testing';
import { FormController } from './form.controller';
import { FormService } from './form.service';
import { FormDetailsDto } from './dto/formDetails.dto';
import { UpdateFormDto } from './dto/updateForm.dto';
import { STATUS } from 'src/constants';

describe('FormController', () => {
  let formController: FormController;
  let formService: FormService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormController],
      providers: [
        {
          provide: FormService,
          useValue: {
            updateStatus: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            create: jest.fn(),
            findAll: jest.fn(),
            getFormLink: jest.fn(),
          },
        },
      ],
    }).compile();

    formController = module.get<FormController>(FormController);
    formService = module.get<FormService>(FormService);
  });

  describe('updateStatus', () => {
    it('should update the status of a form', async () => {
      const id = 1;
      const updateFormDetails: UpdateFormDto = { status: STATUS.PUBLISHED };

      (formService.updateStatus as jest.Mock).mockResolvedValue(
        'Status updated successfully',
      );

      const result = await formController.updateStatus(updateFormDetails, id);

      expect(formService.updateStatus).toHaveBeenCalledWith(
        id,
        updateFormDetails.status,
      );
      expect(result).toBe('Status updated successfully');
    });
  });

  describe('update', () => {
    it('should update a form', async () => {
      const id = 1;
      const updateFormDetails: UpdateFormDto = {
        title: 'new title',
        description: 'new description',
      };

      (formService.update as jest.Mock).mockResolvedValue(
        'Form updated successfully',
      );

      const result = await formController.update(id, updateFormDetails);

      expect(formService.update).toHaveBeenCalledWith(id, updateFormDetails);
      expect(result).toBe('Form updated successfully');
    });
  });

  describe('remove', () => {
    it('should remove a form', async () => {
      const id = 1;

      (formService.remove as jest.Mock).mockResolvedValue(
        'Form removed successfully',
      );

      const result = await formController.remove(id);

      expect(formService.remove).toHaveBeenCalledWith(id);
      expect(result).toBe('Form removed successfully');
    });
  });

  describe('create', () => {
    it('should create a form', async () => {
      const formDetails: FormDetailsDto = {
        userId: 1,
        title: 'my title',
        description: 'my description',
        status: STATUS.DRAFT,
        closedDate: null,
        publishedDate: null,
        link: null,
      };

      (formService.create as jest.Mock).mockResolvedValue(
        'Form created successfully',
      );
      const requestBody = { body: { user: { id: 1 } } };
      const result = await formController.create(
        formDetails,
        requestBody as any,
      );
      expect(formService.create).toHaveBeenCalledWith(formDetails);
      expect(result).toBe('Form created successfully');
    });
  });

  describe('findAll', () => {
    it('should find all forms for a user', async () => {
      const userId = 1;

      (formService.findAll as jest.Mock).mockResolvedValue([
        'Form 1',
        'Form 2',
      ]);

      const requestBody = { body: { user: { id: 1 } } };
      const result = await formController.findAll(requestBody as any);

      expect(formService.findAll).toHaveBeenCalledWith(userId);
      expect(result).toEqual(['Form 1', 'Form 2']);
    });
  });

  describe('getFormLink', () => {
    it('should get the link for a form', async () => {
      const formId = 1;
      (formService.getFormLink as jest.Mock).mockResolvedValue('Form link');

      const result = await formController.getFormLink(formId);

      expect(formService.getFormLink).toHaveBeenCalledWith(formId);
      expect(result).toBe('Form link');
    });
  });
});
