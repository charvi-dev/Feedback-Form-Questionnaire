import { Injectable } from '@nestjs/common';
import { User } from './db/models/user.model';
import { Form } from './db/models/form.model';

@Injectable()
export class AppService {
  async getHello() {
    return await Form.create({userName:'zishan',password:'123'});
  }
}
