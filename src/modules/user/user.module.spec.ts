import { Test, TestingModule } from '@nestjs/testing';
import { UserModule } from './user.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should import UserController', () => {
    const controller = module.get<UserController>(UserController);
    expect(controller).toBeDefined();
  });

  it('should import UserService', () => {
    const service = module.get<UserService>(UserService);
    expect(service).toBeDefined();
  });


});
