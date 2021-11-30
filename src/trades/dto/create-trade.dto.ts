import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTradeDto {
  @ApiProperty({
    name: 'idUserWaiting',
    description: 'id of the creator user',
    example: '61a386bb334ac0413ea10011',
  })
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  idUserWaiting: string;

  @ApiProperty({
    name: 'idUser',
    description: 'id of the other user',
    example: '61a386bb334ac0413ea10012',
  })
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  idUser: string;

  @ApiProperty({
    name: 'accepted',
    description: 'is the trade accepted',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  accepted: boolean;

  @ApiProperty({
    name: 'idCard',
    description: 'id of the creator card',
    example: '61a3c03e334ac0413ea10013',
  })
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  idCard: string;

  @ApiProperty({
    name: 'idCardWanted',
    description: 'id of the creator wanted card',
    example: '61a3c03e334ac0413ea10014',
  })
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  idCardWanted: string;

  @ApiProperty({
    name: 'creationTime',
    description: 'when the trade has been created',
    example: '2021-11-29T21:36:21.000+0100',
  })
  @IsNotEmpty()
  @IsDateString()
  creationTime: string;
}
