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
    description: 'when the notification has been created',
    example: '2021-11-29T21:36:21.000+0100',
  })
  @IsNotEmpty()
  @IsDateString()
  @IsOptional()
  creationTime: string;

  @ApiProperty({
    name: 'read',
    description: 'is the message read',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  read: boolean;

  @ApiProperty({
    name: 'accepted',
    description: 'is the message accepted',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  accepted: boolean;

  @ApiProperty({
    name: 'type',
    description: 'type of notification',
    example: 'notif',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    name: 'content',
    description: 'content of the notification',
    example: 'Hello, I am a notification !',
  })
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  @IsOptional()
  content: string;
}
