import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class Type extends Model {
  @Column
  type: string;
}
