import { ExecutionContext } from '@nestjs/common';
import { UserguardGuard } from './user.guard';
import * as jwt from 'jsonwebtoken';

describe('UserguardGuard', () => {
  let guard: UserguardGuard;

  beforeEach(() => {
    guard = new UserguardGuard();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    // it('should return true and attach user to request when token is valid', () => {
    //     const mockRequest = {
    //       headers: {
    //         authorization: 'Bearer valid-token'
    //       },
    //       body: {}
    //     };
    //     const mockContext = {
    //       switchToHttp: () => ({
    //         getRequest: () => mockRequest
    //       })
    //     } as ExecutionContext;

    //     // Mock user object
    //     const mockUser = {
    //       id: '123',
    //       userName: 'testuser',
    //       password: 'dlkvchidsc'
    //     };

    //     // Mocking the jwt.verify function to handle verification and execute a callback
    //     jest.spyOn(jwt, 'verify').mockImplementation((token, secretOrPublicKey, options, callback) => {
    //       // Simulate successful verification by executing the callback with the mock user object
    //       callback(null, mockUser);
    //     });

    //     expect(guard.canActivate(mockContext)).toEqual(true);
    //     expect(mockRequest['user']).toEqual(mockUser);
    //   });

    it('should return false when no authorization header is provided', () => {
      const mockRequest = {
        headers: {},
        body: {},
      };
      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as ExecutionContext;

      expect(guard.canActivate(mockContext)).toEqual(false);
      expect(mockRequest['user']).toBeUndefined();
    });

    it('should return false when authorization header is malformed', () => {
      const mockRequest = {
        headers: {
          authorization: 'InvalidTokenFormat',
        },
        body: {},
      };
      const mockContext = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
      } as ExecutionContext;

      expect(guard.canActivate(mockContext)).toEqual(false);
      expect(mockRequest['user']).toBeUndefined();
    });

    // it('should return false when token is invalid', () => {
    //   const mockRequest = {
    //     headers: {
    //       authorization: 'Bearer invalid-token'
    //     },
    //     body: {}
    //   };
    //   const mockContext = {
    //     switchToHttp: () => ({
    //       getRequest: () => mockRequest
    //     })
    //   } as ExecutionContext;

    //   jest.spyOn(jwt, 'verify').mockImplementation(() => {
    //     throw new Error('Invalid token');
    //   });

    //   expect(guard.canActivate(mockContext)).toEqual(false);
    //   expect(mockRequest['user']).toBeUndefined();
    // });
  });
});
