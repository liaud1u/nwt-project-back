import { IsNotEmpty } from 'class-validator';

export class HandlerBody {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  password: string;
}
