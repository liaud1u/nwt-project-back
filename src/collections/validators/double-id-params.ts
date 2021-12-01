import { IsMongoId, IsNotEmpty } from 'class-validator';

export class DoubleIdParams {
  @IsMongoId()
  @IsNotEmpty()
  idCard: string;

  @IsMongoId()
  @IsNotEmpty()
  idUser: string;
}
