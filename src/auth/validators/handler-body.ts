import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class HandlerBody {
  @ApiProperty({
    name: 'username',
    description: 'Unique username',
    example: 'JeanCristhobaldo',
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    name: 'password',
    description: 'Password',
    example: 'password',
  })
  @IsNotEmpty()
  password: string;
}
