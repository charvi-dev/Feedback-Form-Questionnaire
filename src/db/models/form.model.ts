import { Column, Model, Table } from 'sequelize-typescript';
import { User } from './user.model';

@Table
export class Form extends Model {
  @Column
  title: string;

  @Column({references:{model:User,key:'id'}})
  userId:number
 
  @Column
  description: string;

  @Column
  status: 'draft'|'published'|'closed'

  @Column
  publishedDate: Date;

  @Column
  closeDate: Date;

  @Column
  link: string;
  
}