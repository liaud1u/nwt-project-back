import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    name: 'username',
    description: 'Unique username',
    example: 'VictorDu34',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

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
    description: 'Birthdate with an universal format',
    example: '2000/12/31',
  })
  @IsNotEmpty()
  @IsString()
  birthDate: string;

  @ApiPropertyOptional({
    name: 'photo',
    description: 'Photo of the User',
    example: 'https://randomuser.me/portraits/men/55.jpg',
  })
  @IsOptional()
  @IsString()
  photo?: string;
}
