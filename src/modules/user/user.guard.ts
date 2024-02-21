// import {
//   CanActivate,
//   ExecutionContext,
//   ForbiddenException,
//   Injectable,
// } from '@nestjs/common';
// import * as jwt from 'jsonwebtoken';
// import { Observable } from 'rxjs';

// @Injectable()
// export class UserguardGuard implements CanActivate {
//   canActivate(
//     context: ExecutionContext,
//   ): boolean | Promise<boolean> | Observable<boolean> {
//     const request = context.switchToHttp().getRequest();
//     const authorizationHeader = request.headers.authorization;

//     if (!authorizationHeader) {
//       console.error('No Authorization header provided');
//       return false;
//     }

//     const [bearer, token] = authorizationHeader.split(' ');

//     if (bearer !== 'Bearer' || !token) {
//       return false;
//     }

//     try {
//       const decoded = jwt.verify(token, 'charvisalonishamudro');
//       request.body['user'] = decoded;
//       return true;
//     } catch (error) {
//       console.error('Invalid token');
//       return false
//     }
//   }
// }
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { log } from 'console';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserguardGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    console.log(request);
    
    const authorizationHeader = request.headers.authorization;
    
    if (!authorizationHeader) {
      console.error('No Authorization header provided');
      return false;
    }

    const [bearer, token] = authorizationHeader.split(' ');
    
    if (bearer !== 'Bearer' || !token) {
      return false;
    }

    try {
      const decoded = jwt.verify(token, 'charvisalonishamudro');
      request['user'] = decoded;
      return true; 
    } catch (error) {
      console.error('Invalid token');
      return false;
    }
  }
}
