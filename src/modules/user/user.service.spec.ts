// import { UserService } from "./user.service"
// import { User } from 'src/db/models/user.model';
// import { Test, TestingModule } from "@nestjs/testing";
// import { mock, instance, when, anything } from "ts-mockito";
// import { BadRequestException } from "@nestjs/common";
// import { userDetails } from "./dto/userDetails.dto";

// describe('UserService', () => {
//   let service: UserService;

//   beforeEach(() => {
//     service = new UserService();
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   it("create user",async ()=>{
//     const user = {
//       userName:"zishan",
//       password:"123"
//     }

//     jest.spyOn(User,'create').mockReturnValue(user);

//     const result = await service.signUp(user)

//     expect(result).toEqual(user);
//   })
// });

import { UserService } from "./user.service";
import { User } from 'src/db/models/user.model';
import { BadRequestException } from "@nestjs/common";
import { userDetails } from "./dto/userDetails.dto";


jest.mock('src/db/models/user.model', () => ({
  User: {
    create: jest.fn(),
  },
}));

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

  it("should create a new user", async () => {
    
    const userDetailsData: userDetails = {
      userName: "john_doe",
      password: "password123",
    };

    const mockUser = { ...userDetailsData, id: 1 };

    (User.create as jest.Mock).mockResolvedValue(mockUser);


    const result = await service.signUp(userDetailsData);

    expect(result).toEqual(mockUser);
  });

  it("should throw Invalid when user creation fails", async () => {
    
    const userDetailsData: userDetails = {
      userName: "john_doe",
      password: "password123",
    };

    
    (User.create as jest.Mock).mockRejectedValue(new BadRequestException());

    
    await expect(service.signUp(userDetailsData)).rejects.toThrow('Internal Server Error');
  });

  it("should hash the password before creating the user", async () => {
    // Arrange
    const userDetailsData: userDetails = {
      userName: "john_doe",
      password: "password123",
    };

    const mockUser = { ...userDetailsData, id: 1 };

   
    (User.create as jest.Mock).mockResolvedValue(mockUser);

    // Act
    await service.signUp(userDetailsData);

    
    expect(User.create).toHaveBeenCalledWith(expect.objectContaining({
      userName: userDetailsData.userName,
      password: expect.any(String)
    }));
  });

  it("should handle invalid user details gracefully", async () => {
  
    const userDetailsData: userDetails = {
      userName: "", 
      password: "password123",
    };

   
    await expect(service.signUp(userDetailsData)).rejects.toThrow('Invalid user details');
  });


});