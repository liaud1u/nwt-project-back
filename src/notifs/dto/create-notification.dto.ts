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

export class CreateNotificationDto {
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
    name: 'read',
    description: 'is the message read',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  read: boolean;

  @ApiProperty({
    name: 'accepted',
    description: 'is the message accepted',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  accepted: boolean;

  @ApiProperty({
    name: 'type',
    description: 'type of notification',
    example: 'notif',
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    name: 'content',
    description: 'content of the notification',
    example: 'Hello, I am a notification !',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    name: 'creationTime',
    description: 'when the notification has been created',
    example: '2021-11-29T21:36:21.000+0100',
  })
  @IsNotEmpty()
  @IsDateString()
  creationTime: string;
}
