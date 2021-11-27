import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePersonDto {
  @ApiProperty({
    name: 'pseudo',
    description: 'Unique pseudo',
    example: 'VictorDu34',
  })
  @IsString()
  @IsNotEmpty()
  pseudo: string;

  @ApiProperty({
    name: 'firstname',
    description: 'Firstname',
    example: 'Mclaughlin',
  })
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @ApiProperty({
    name: 'lastname',
    description: 'Lastname',
    example: 'Cochran',
  })
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({
    name: 'email',
    description: 'Email',
    example: 'Mclaughlin.Cochran@undefined.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    name: 'password',
    description: 'Password',
    example: 'HTeu4ud.S+@84/6',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    name: 'birthDate',
    description: 'Birthdate in timestamp format',
    example: '101343600000',
  })
  @IsNotEmpty()
  @IsNumber()
  birthDate: number;

  @ApiPropertyOptional({
    name: 'photo',
    description: 'Photo of the User',
    example: 'https://randomuser.me/portraits/men/55.jpg',
  })
  @IsOptional()
  @IsString()
  photo?: string;
}
