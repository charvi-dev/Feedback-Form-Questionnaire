import { Test, TestingModule } from '@nestjs/testing';
import { OptionController } from './option.controller';
import { OptionService } from './option.service';
import { OptionDto } from './dto/option.dto';

describe('OptionController', () => {
  let controller: OptionController;
  let service: OptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OptionController],
      providers: [
        {
          provide: OptionService,
          useValue: {
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OptionController>(OptionController);
    service = module.get<OptionService>(OptionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('update', () => {
    it('should update an option', async () => {
      const id = 1;
      const optionDto: OptionDto = {
        optionText: 'new question',
        questionId: 2,
      };

      await controller.update(id, optionDto);

      expect(service.update).toHaveBeenCalledWith(id, optionDto);
    });
  });

  describe('remove', () => {
    it('should remove an option', async () => {
      const id = 1;

      await controller.remove(id);

      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});
