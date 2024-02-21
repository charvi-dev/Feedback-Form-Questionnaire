import { Column, Model, Table } from 'sequelize-typescript';
import { Question } from './question.model';

@Table({ tableName: 'option' })
export class Option extends Model {
  @Column({ references: { model: Question, key: 'id' }, onDelete: 'CASCADE' })
  questionId: number;

  @Column
  optionText: string;
}
