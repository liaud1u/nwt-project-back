import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class CardEntity {
  @ApiProperty({
    name: 'id',
    description: 'Unique identifier in the database',
    example: '5764cd4dc378a38ecd387737',
  })
  @Expose()
  @Type(() => String)
  id: string;

  @ApiProperty({
    name: 'name',
    description: 'Name of the card in the database',
    example: 'Gare de Nancy',
  })
  @Expose()
  @Type(() => String)
  name: string;

  @ApiProperty({
    name: 'description',
    description: 'Description of the card',
    example:
      'La gare de Nancy est très importante pour la ville elle est un axe centrale pour le transport',
  })
  @Expose()
  @Type(() => String)
  description: string;

  @ApiProperty({
    name: 'level',
    description: 'Level of the card',
    example: 5,
  })
  @Expose()
  @Type(() => Number)
  level: number;

  @ApiProperty({
    name: 'image',
    description: 'Image to illustrate the card',
    example:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Fontaine_de_Neptune_sur_la_Place_Stanislas.jpg/1920px-Fontaine_de_Neptune_sur_la_Place_Stanislas.jpg',
  })
  @Expose()
  @Type(() => String)
  image: string;

  /**
   * Class constructor
   *
   * @param partial data to insert in object instance
   */
  constructor(partial: Partial<CardEntity>) {
    Object.assign(this, partial);
  }
}
