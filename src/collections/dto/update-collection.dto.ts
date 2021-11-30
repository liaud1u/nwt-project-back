import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateCollectionDto {
  @ApiProperty({
    name: 'idCard',
    description: 'id of the referring card',
    example: '61a3c03e334ac0413ea10014',
  })
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  idCard: string;

  @ApiProperty({
    name: 'idUser',
    description: 'id of the referring user',
    example: '61a386bb334ac0413ea10011',
  })
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  idUser: string;

  @ApiProperty({
    name: 'amount',
    description: 'amount of this card the user have',
    example: 4,
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    name: 'waiting',
    description: 'amount of this card wich is currently waiting for a trade',
    example: 0,
  })
  @IsNumber()
  @IsNotEmpty()
  waiting: number;
}
