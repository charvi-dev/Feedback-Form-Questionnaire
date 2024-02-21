import { IsNotEmpty, Length, Matches } from 'class-validator';
export class userDetails {
  @Length(3, 100)
  userName: string;

  @Length(6, 50)
  password: string;
}
