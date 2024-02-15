import { Column, Model, Table } from 'sequelize-typescript';
import { Form } from './form.model';


@Table({ tableName: 'question' })
export class Question extends Model {
  @Column({ references: { model: Form, key: 'id' } })
  formId: number;

  @Column
  questionDescription: string;

  @Column
  type: string;
}
