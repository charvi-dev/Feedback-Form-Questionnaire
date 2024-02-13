import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FormController } from './modules/form/form.controller';
import { OptionController } from './modules/option/option.controller';
import { QuestionController } from './modules/question/question.controller';
import { SubmissionController } from './modules/submission/submission.controller';
import { UserController } from './modules/user/user.controller';
import { FormService } from './modules/form/form.service';
import { OptionService } from './modules/option/option.service';
import { QuestionService } from './modules/question/question.service';
import { SubmissionService } from './modules/submission/submission.service';
import { UserService } from './modules/user/user.service';
import { UserModule } from './modules/user/user.module';
import { FormModule } from './modules/form/form.module';
import { OptionModule } from './modules/option/option.module';
import { QuestionModule } from './modules/question/question.module';
import { SubmissionModule } from './modules/submission/submission.module';

@Module({
  imports: [
    UserModule,
    FormModule,
    OptionModule,
    QuestionModule,
    SubmissionModule,
  ],
  controllers: [
    AppController,
    FormController,
    OptionController,
    QuestionController,
    SubmissionController,
    UserController,
  ],
  providers: [
    AppService,
    FormService,
    OptionService,
    QuestionService,
    SubmissionService,
    UserService,
  ],
})
export class AppModule {}
