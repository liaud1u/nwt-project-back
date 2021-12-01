import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class CollectionEntity {
  @ApiProperty({
    name: 'id',
    description: 'Unique identifier in the database',
    example: '5764cd4dc378a38ecd387737',
  })
  @Expose()
  @Type(() => String)
  id: string;

  @ApiProperty({
    name: 'amount',
    description: 'Amount of the collection for the user',
    example: 8,
  })
  @Expose()
  @Type(() => Number)
  amount: number;

  @ApiProperty({
    name: 'waiting',
    description:
      'Amount of card of this collection waiting currently in a trading state',
    example: 8,
  })
  @Expose()
  @Type(() => Number)
  waiting: number;

  @ApiProperty({
    name: 'idUser',
    description: 'Id of the owner of the collection',
    example: '61a386bb334ac0413a10011',
  })
  @Expose()
  @Type(() => String)
  idUser: string;

  @ApiProperty({
    name: 'idCard',
    description: 'Id of the card',
    example: '61a3c03e334ac0413a10013',
  })
  @Expose()
  @Type(() => String)
  idCard: string;

  /**
   * Class constructor
   *
   * @param partial data to insert in object instance
   */
  constructor(partial: Partial<CollectionEntity>) {
    Object.assign(this, partial);
  }
}
