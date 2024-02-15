import {
  Controller,
  Post,
  Body,
  Put,
  UseGuards,
  Get,
  Headers,
} from '@nestjs/common';
import { UserService } from './user.service';
import { userDetails } from './dto/userDetails.dto';
import { UserguardGuard } from './userguard.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signUp')
  signUp(@Body() signUpDetails: userDetails) {
    return this.userService.signUp(signUpDetails);
  }

  @Post('/login')
  login(@Body() loginDetails: userDetails) {
    return this.userService.login(loginDetails);
  }

  @Put('/update')
  @UseGuards(UserguardGuard)
  updateUserDetails(
    @Body() updateDetails: userDetails,
    @Headers('Authorization') authorization: string,
  ) {
    const jwtToken = authorization.replace('Bearer ', '');

    return this.userService.updateDetails(updateDetails, jwtToken);
  }
}
