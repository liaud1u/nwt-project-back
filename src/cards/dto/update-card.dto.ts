import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class UpdateCardDto {
  @ApiProperty({
    name: 'name',
    description: 'Name of the card',
    example: 'Place Blanche',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    name: 'description',
    description: 'Description of the card',
    example: 'Une place à Paris dans le 9ième',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    name: 'level',
    description: 'Level of the card',
    example: 3,
  })
  @IsInt()
  @IsNotEmpty()
  level: number;

  @ApiProperty({
    name: 'image',
    description: 'URL to the image of the card',
    example:
      'https://upload.wikimedia.org/wikipedia/commons/2/29/Paris_75018_Place_Blanche_Moulin_Rouge_01c_frontal.jpg',
  })
  @IsInt()
  @IsNotEmpty()
  image: string;
}
