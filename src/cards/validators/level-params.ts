import { IsInt, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class LevelParams {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  level: number;
}
