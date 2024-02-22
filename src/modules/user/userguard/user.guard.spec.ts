import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserguardGuard } from './user.guard';
import { ForbiddenException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

describe('UserguardGuard', () => {
  let guard: UserguardGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserguardGuard],
    }).compile();

    guard = module.get<UserguardGuard>(UserguardGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true and attach user to request body for valid token', () => {
      const mockRequest: any = {
        headers: {
          authorization: 'Bearer validToken',
        },
        body: {},
      };
      const mockContext = {
        switchToHttp: jest.fn().mockReturnThis(),
        getRequest: jest.fn().mockReturnValue(mockRequest),
      } as unknown as ExecutionContext;

      jest
        .spyOn(jwt, 'verify')
        .mockReturnValue({ id: '123', userName: 'testuser' });

      const result = guard.canActivate(mockContext);

      expect(result).toBe(true);
      expect(mockRequest.body.user).toEqual({
        id: '123',
        userName: 'testuser',
      });
    });

    it('should return false for missing token', () => {
      const mockRequest: any = {
        headers: {},
      };
      const mockContext = {
        switchToHttp: jest.fn().mockReturnThis(),
        getRequest: jest.fn().mockReturnValue(mockRequest),
      } as unknown as ExecutionContext;

      const result = guard.canActivate(mockContext);

      expect(result).toBe(false);
    });

    it('should throw ForbiddenException for invalid token', () => {
      const mockRequest: any = {
        headers: {
          authorization: 'Bearer invalidToken',
        },
      };
      const mockContext = {
        switchToHttp: jest.fn().mockReturnThis(),
        getRequest: jest.fn().mockReturnValue(mockRequest),
      } as unknown as ExecutionContext;

      expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
    });
  });
});
