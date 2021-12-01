import { IsMongoId, IsNotEmpty } from 'class-validator';

export class UsersParams {
  @IsMongoId()
  @IsNotEmpty()
  idUser: string;
}
