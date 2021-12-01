import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({
    name: 'idUser',
    description: 'Id of the referring user',
    example: '61a386bb334ac0413ea10011',
  })
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  idUser: string;

  @ApiProperty({
    name: 'read',
    description: 'True if the message is read',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  read: boolean;

  @ApiProperty({
    name: 'accepted',
    description: 'True if the message is accepted',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  accepted: boolean;

  @ApiProperty({
    name: 'type',
    description: 'Type of notification',
    example: 'notif',
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    name: 'content',
    description: 'Content of the notification',
    example: 'Hello, I am a notification !',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    name: 'creationTime',
    description: 'Date when the notification has been created',
    example: '2021-11-29T21:36:21.000+0100',
  })
  @IsNotEmpty()
  @IsDateString()
  creationTime: string;
}
