import { Column, Model, Table } from 'sequelize-typescript';
import{Form} from './form.model'


@Table
export class Submission extends Model {
  @Column({references:{model:Form,key:'id'}})
  formId: number;

  @Column
  submissionDate: Date;

  @Column
  formResponse: JSON

}