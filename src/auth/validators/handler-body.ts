import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class HandlerBody {
  @ApiProperty({
    name: 'username',
    description: 'Unique username',
    example: 'VictorDu34',
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    name: 'password',
    description: 'Password',
    example: 'HTeu4ud.S+@84/6',
  })
  @IsNotEmpty()
  password: string;
}
