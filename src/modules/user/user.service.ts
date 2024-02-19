import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/db/models/user.model';
import { userDetails } from './dto/userDetails.dto';

@Injectable()
export class UserService {
  // private async hashPassword(password: string) {
  //   return bcrypt.hash(password, 10);
  // }
  

  async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, 10);
    } catch (error) {
      console.error('Error during password hashing:', error);
      throw new Error('Failed to hash password');
    }
  }

  async signUp(signUpDetails: userDetails) {
    if(!signUpDetails.userName || !signUpDetails.password) {
      throw new Error('Invalid user details');
    }
    try {
      const hashedPassword = await this.hashPassword(signUpDetails.password);
      const res = await User.create({
        userName: signUpDetails.userName,
        password: hashedPassword,
      });
      return res;
    } catch (error) {
      // throw new Error('Invalid user details');
   
      throw new InternalServerErrorException();
    }
  }

  async login(loginDetails: userDetails) {
    try {
      const stored = await User.findOne({
        where: { userName: loginDetails.userName },
      });
      const isMatch = stored
        ? await bcrypt.compare(loginDetails.password, stored.password)
        : false;
      if (isMatch) {
        const payload = {
          id: stored.id,
          userName: stored.userName,
          password: stored.password,
        };
        const token = await jwt.sign(payload, 'charvisalonishamudro', {
          expiresIn: '1h',
        });
        return token;
      } else {
        return 'Wrong userName or password';
      }
    } catch (error) {
      return { error };
    }
  }

  async updateDetails(updateDetails: userDetails, jwtToken: string) {
    try {
      const id = this.getUserIdFromToken(jwtToken);

      const user = await User.findByPk(id);

      if (updateDetails.userName) {
        user.userName = updateDetails.userName;
      }

      if (updateDetails.password) {
        const hashedPassword = await this.hashPassword(updateDetails.password);
        user.password = hashedPassword;
      }

      await user.save();

      return 'User details updated successfully';
    } catch (error) {
      throw new NotFoundException();
    }
  }

  getUserIdFromToken(token: string): number {
    try {
      const decodedToken: any = jwt.verify(token, 'charvisalonishamudro');
      return decodedToken.id;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
