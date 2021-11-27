import { IsNotEmpty } from 'class-validator';

export class HandlerBody {
  //@IsMongoId()
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  password: string;
}
