import { IsNotEmpty } from 'class-validator';

export class HandlerBody {
  //@IsMongoId()
  @IsNotEmpty()
  pseudo: string;
  @IsNotEmpty()
  password: string;
}
