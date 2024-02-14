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
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './db/models/user.model';
import { Type } from './db/models/type.model';
import { Option } from './db/models/option.model';
import { Submission } from './db/models/submission.model';
import { Question } from './db/models/question.model';
import { Form } from './db/models/form.model';
import { TypeController } from './modules/type/type.controller';
import { TypeService } from './modules/type/type.service';
import { TypeModule } from './modules/type/type.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Asdf!234',
      database: 'feedbackQuestionnaire',
      autoLoadModels: true,
      synchronize: false,
      models: [User, Form, Type, Question, Submission, Option],
    }),
    UserModule,
    FormModule,
    OptionModule,
    QuestionModule,
    SubmissionModule,
    TypeModule,
  ],
  controllers: [
    AppController,
    FormController,
    OptionController,
    QuestionController,
    SubmissionController,
    UserController,
    TypeController,
  ],
  providers: [
    AppService,
    FormService,
    OptionService,
    QuestionService,
    SubmissionService,
    UserService,
    TypeService,
  ],
})
export class AppModule {}
