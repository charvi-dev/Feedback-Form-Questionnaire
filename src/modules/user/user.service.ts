import { BadRequestException, Injectable } from '@nestjs/common';
import { userDetails } from './dto/userDetails.dto';
import { User } from 'src/db/models/user.model';

@Injectable()
export class UserService {

  async signUp(signUpDetails: userDetails) {
    try {
      const res =  await User.create({userName:signUpDetails.userName,password:signUpDetails.password});
      return res;
    } catch (error) {
      throw new BadRequestException(error["errors"])
    }
  }

  login(loginDetails:userDetails){
    try {
      return "jwt token"
    } catch (error) {
      
    }
  }

  update(updateDetails:userDetails) {
    return "Updated User";
  }

}
