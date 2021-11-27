import { IsNotEmpty } from 'class-validator';

export class ConnexionParams {
  @IsNotEmpty()
  pseudo: string;
  @IsNotEmpty()
  password: string;
}
