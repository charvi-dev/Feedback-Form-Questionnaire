import { Injectable } from '@nestjs/common';
import { User } from './db/models/user.model';

@Injectable()
export class AppService {
  async getHello() {
    return await User.create({userName:'zishan',password:'123'});
  }
}
