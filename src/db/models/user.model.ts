import { Column, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'user' })
export class User extends Model {
  @Column
  userName: string;

  @Column
  password: string;
}
