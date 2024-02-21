import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { userDetails } from './dto/userDetails.dto';
import { User } from 'src/db/models/user.model';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp', () => {
    it('should call userService.signUp with provided userDetails', async () => {
      const mockUserDetails: userDetails = {
        userName: 'Charvi',
        password: 'Charvi@3107'
      };
  
   
      const signUpSpy = jest.spyOn(userService, 'signUp').mockResolvedValueOnce({} as User);
  
      
      await controller.signUp(mockUserDetails);
  
   
      expect(signUpSpy).toHaveBeenCalledWith(mockUserDetails);
    });
  });
  

  describe('login', () => {
    it('should call userService.login with provided userDetails', async () => {
      const mockUserDetails: userDetails = {
        userName: 'Charvi',
        password: 'Charvi@3107'
      };
      const loginSpy = jest.spyOn(userService, 'login').mockResolvedValueOnce({token:""});

      await controller.login(mockUserDetails);

      expect(loginSpy).toHaveBeenCalledWith(mockUserDetails);
    });
  });

  describe('updateUserDetails', () => {
    it('should call userService.updateDetails with provided userDetails and jwtToken', async () => {
      const mockUserDetails: userDetails = {
        userName: 'Charvi',
        password: 'Charvi@3107'
      };
      const jwtToken = 'mockJWTToken';
      const mockAuthorizationHeader = `Bearer ${jwtToken}`;
      const updateDetailsSpy = jest.spyOn(userService, 'updateDetails').mockResolvedValueOnce('');

      await controller.updateUserDetails(mockUserDetails, mockAuthorizationHeader);

      expect(updateDetailsSpy).toHaveBeenCalledWith(mockUserDetails, jwtToken);
    });
  });
});


