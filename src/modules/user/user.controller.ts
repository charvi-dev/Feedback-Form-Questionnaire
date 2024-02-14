import {
  Controller,
  Post,
  Body,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { userDetails } from './dto/userDetails.dto';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('/signUp')
  signUp(@Body() signUpDetails: userDetails) {
    return this.userService.signUp(signUpDetails);
  }

  @Post('/login')
  login(@Body() loginDetails: userDetails) {
    return this.userService.login(loginDetails)
  }

  @Put('/')
  updateDetails(@Body() updateDetails:userDetails){
   return this.userService.update(updateDetails)
  }
}
