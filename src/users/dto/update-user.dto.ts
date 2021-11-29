import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    name: 'username',
    description: 'Unique username',
    example: 'VictorDu34',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  username?: string;

  @ApiProperty({
    name: 'firstname',
    description: 'Firstname',
    example: 'Jean',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  firstname?: string;

  @ApiProperty({
    name: 'lastname',
    description: 'Lastname',
    example: 'Cristho',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  lastname?: string;

  @ApiProperty({
    name: 'email',
    description: 'Email',
    example: 'Jean.Cristho@mail.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    name: 'password',
    description: 'Password',
    example: 'HTeu4ud.S+@84/6',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @IsOptional()
  password?: string;

  @ApiProperty({
    name: 'birthDate',
    description: 'Birthdate with an universal format',
    example: '2000-12-31',
  })
  @IsNotEmpty()
  @IsDateString()
  @IsOptional()
  birthDate?: any;

  @ApiPropertyOptional({
    name: 'photo',
    description: 'Photo of the User',
    example: 'https://randomuser.me/portraits/men/55.jpg',
  })
  @IsOptional()
  @IsString()
  photo?: string;
}
