import { IsNotEmpty } from 'class-validator';

export class HandlerRequests {
  //@IsMongoId()
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  password: string;
}
