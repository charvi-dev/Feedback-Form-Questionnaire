import { Column, Model, Table } from 'sequelize-typescript';
import{Form} from './form.model'
import {Type} from './type.model'
@Table
export class Question extends Model {
  @Column({references:{model:Form,key:'id'}})
  formId: number;

  @Column
  questionDescription: string;

  @Column({references:{model:Type,key:'id'}})
  typeId: number


  


  


 

  
 
}