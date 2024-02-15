import { Column, Model, Table } from 'sequelize-typescript';
import { User } from './user.model';

@Table({ tableName: 'form' })
export class Form extends Model {
  @Column
  title: string;

  @Column({ references: { model: User, key: 'id' } })
  userId: number;

  @Column
  description: string;

  @Column
  status: string;

  @Column
  publishedDate: Date;

  @Column
  closedDate: Date;

  @Column
  link: string;
}
