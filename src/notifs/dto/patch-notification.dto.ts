import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class PatchNotificationDto {
  @ApiProperty({
    name: 'idUser',
    description: 'id of the referring user',
    example: '61a386bb334ac0413ea10011',
  })
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  @IsOptional()
  idUser: string;

  @ApiProperty({
    name: 'creationTime',
    description: 'Date when the notification has been created',
    example: '2021-11-29T21:36:21.000+0100',
  })
  @IsNotEmpty()
  @IsDateString()
  @IsOptional()
  creationTime: string;

  @ApiProperty({
    name: 'read',
    description: 'True if the message is read',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  read: boolean;

  @ApiProperty({
    name: 'accepted',
    description: 'True if the message is accepted',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  accepted: boolean;

  @ApiProperty({
    name: 'type',
    description: 'Type of notification',
    example: 'notif',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    name: 'content',
    description: 'Content of the notification',
    example: 'Hello, I am a notification !',
  })
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  @IsOptional()
  content: string;
}
