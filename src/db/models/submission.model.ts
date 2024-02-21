import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { Form } from './form.model';

@Table({ tableName: 'submission' })
export class Submission extends Model {
  @Column({ references: { model: Form, key: 'id' } })
  formId: number;

  @Column
  submissionDate: Date;

  @Column({ type: DataType.JSON })
  formResponse: any;
}
