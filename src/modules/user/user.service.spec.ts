import { UserService } from "./user.service";
import { User } from 'src/db/models/user.model';
import { userDetails } from "./dto/userDetails.dto";
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';

jest.mock('src/db/models/user.model', () => ({
  User: {
    create: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
  },
}));



jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    it('should create a new user with hashed password', async () => {
      const userDetailsData: userDetails = {
        userName: 'Charvi',
        password: 'Charvi@3107',
      };
      const hashedPassword = '1123454544@###mmll'; 
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      (User.create as jest.Mock).mockResolvedValue(userDetailsData);

      const result = await service.signUp(userDetailsData);

      expect(bcrypt.hash).toHaveBeenCalledWith(userDetailsData.password, 10);
      expect(User.create).toHaveBeenCalledWith({
        userName: userDetailsData.userName,
        password: hashedPassword,
      });
      expect(result).toEqual(userDetailsData);
    });

    it('should throw an Internal Server Error when user creation fails', async () => {
      const userDetailsData: userDetails = {
        userName: 'Charvi',
        password: 'Charvi@3107',
      };
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (User.create as jest.Mock).mockRejectedValue(new BadRequestException());

      await expect(service.signUp(userDetailsData)).rejects.toThrow(InternalServerErrorException);
    });

    it('should handle invalid user details', async () => {
      const userDetailsData: userDetails = {
        userName: '',
        password: 'Charvi@3107',
      };

      await expect(service.signUp(userDetailsData)).rejects.toThrow('Invalid user details');
    });
  });

  describe('login', () => {
    it('should return a JWT token if login is successful', async () => {
      const loginDetails: userDetails = {
        userName: 'Charvi',
        password: 'Charvi@3107',
      };
      const storedUser = {
        id: 1,
        userName: 'Charvi',
        password: 'hashedPassword',
      };
      (User.findOne as jest.Mock).mockResolvedValue(storedUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('mockToken');

      const token = await service.login(loginDetails);

      expect(User.findOne).toHaveBeenCalledWith({ where: { userName: loginDetails.userName } });
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDetails.password, storedUser.password);
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: storedUser.id, userName: storedUser.userName, password: storedUser.password },
        'charvisalonishamudro',
        { expiresIn: '1h' }
      );
      expect(token).toBe('mockToken');
    });

    it('should return an error message if login credentials are incorrect', async () => {
      const loginDetails: userDetails = {
        userName: 'Charvi',
        password: 'Charvi@3107',
      };
      (User.findOne as jest.Mock).mockResolvedValue(null);

      const result = await service.login(loginDetails);

      expect(User.findOne).toHaveBeenCalledWith({ where: { userName: loginDetails.userName } });
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(jwt.sign).not.toHaveBeenCalled();
      expect(result).toBe('Wrong userName or password');
    });
  });

  describe('updateDetails', () => {
    it('should update user details', async () => {
      const updateDetails: userDetails = {
        userName: 'newUserName',
        password: 'newPassword',
      };
      const jwtToken = 'mockToken';
   

      jest.spyOn(service,'getUserIdFromToken').mockReturnValue(1)

      const storedUser = {
        id: 1,
        userName: 'Charvi',
     
        password: '$2b$10$Nn.kmGdxHqkd9.GSvE5O.OxRe20vMVd2V.DG29Dy8lzi2qz3zfpz2',
        save: jest.fn(),
      };
      (User.findByPk as jest.Mock).mockResolvedValue(storedUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue('newHashedPassword');
    
      const result = await service.updateDetails(updateDetails, jwtToken);
    
      expect(User.findByPk).toHaveBeenCalledWith(storedUser.id);
      expect(bcrypt.hash).toHaveBeenCalledWith(updateDetails.password, 10);
      expect(storedUser.userName).toBe(updateDetails.userName);
      expect(storedUser.password).toBe('newHashedPassword');
      expect(storedUser.save).toHaveBeenCalled();
      expect(result).toBe('User details updated successfully');
    });
    

    

    it('should throw NotFoundException if user is not found', async () => {
      const updateDetails: userDetails = {
        userName: 'newUserName',
        password: 'newPassword',
      };
      const jwtToken = 'mockToken';

      const getUserIdFromTokenSpy = jest.spyOn(service, 'getUserIdFromToken');
     
      getUserIdFromTokenSpy.mockReturnValue(1);

      (User.findByPk as jest.Mock).mockResolvedValue(null);
    
      await expect(service.updateDetails(updateDetails, jwtToken)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getUserIdFromToken', () => {
    it('should return user ID from JWT token', () => {
      const token = 'mockToken';
      const userId = 1;
      const decodedToken = { id: userId };
      (jwt.verify as jest.Mock).mockReturnValue(decodedToken);

      const result = service.getUserIdFromToken(token);

      expect(jwt.verify).toHaveBeenCalledWith(token, 'charvisalonishamudro');
      expect(result).toBe(userId);
    });

    it('should throw an error if token is invalid', () => {
      const token = 'invalidToken';
      (jwt.verify as jest.Mock).mockImplementation(() => { throw new Error('Invalid token') });

      expect(() => service.getUserIdFromToken(token)).toThrow('Invalid token');
    });
  });


  describe('hashPassword', () => {
    it('should hash the password successfully', async () => {
      const password = 'Charvi@3107';
      const expectedHashedPassword = '$2b$10$mockHashedPassword';

      jest.spyOn(bcrypt, 'hash').mockImplementation(async () => expectedHashedPassword);
   
      const hashedPassword = await service.hashPassword(password);
  
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(hashedPassword).toEqual(expectedHashedPassword);
    });

    it('should throw an error if password hashing fails', async () => {
      const password = 'testPassword';
  
   
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => { throw new Error('Failed to hash password'); });
  
      await expect(service.hashPassword(password)).rejects.toThrow('Failed to hash password');
    });
  });
  });

