import { IsMongoId, IsNotEmpty } from 'class-validator';

export class HandlerParams {
  @IsMongoId()
  @IsNotEmpty()
  id: string;
}

export class DoubleHandlerParams {
  @IsMongoId()
  @IsNotEmpty()
  idCard: string;

  @IsMongoId()
  @IsNotEmpty()
  idUser: string;
}
