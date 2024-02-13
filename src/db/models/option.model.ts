import { Column, Model, Table } from 'sequelize-typescript';
import { Question } from './question.model';

@Table
export class Option extends Model {
  @Column({references:{model:Question,key:'id'}})
  questionId: number

  @Column
  optionText:string
}