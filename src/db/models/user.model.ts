import { Column, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'user' })
export class User extends Model {
  @Column({ unique: true })
  userName: string;

  @Column
  password: string;
}
