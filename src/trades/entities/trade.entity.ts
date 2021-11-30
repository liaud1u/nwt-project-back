import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class TradeEntity {
  @ApiProperty({
    name: 'id',
    description: 'Unique identifier in the database',
    example: '61a53416334ac0413ea1001f',
  })
  @Expose()
  @Type(() => String)
  id: string;

  @ApiProperty({
    name: 'creationTime',
    description: 'Trade creation date',
    example: '2021-11-29T21:36:21.000+0100',
  })
  @Expose()
  @Type(() => String)
  creationTime: string;

  @ApiProperty({
    name: 'idUserWaiting',
    description: 'Id of the creator of the trade',
    example: '61a386bb334ac0413a10011',
  })
  @Expose()
  @Type(() => String)
  idUserWaiting: string;

  @ApiProperty({
    name: 'idUser',
    description: 'Id of the other user of the trade',
    example: '61a386bb334ac0413a10012',
  })
  @Expose()
  @Type(() => String)
  idUser: string;

  @ApiProperty({
    name: 'accepted',
    description: 'Trade accepted',
    example: false,
  })
  @Expose()
  @Type(() => Boolean)
  accepted: boolean;

  @ApiProperty({
    name: 'idCardWanted',
    description: 'Id of the card wanted from by the creator',
    example: '61a3c03e334ac0413a10013',
  })
  @Expose()
  @Type(() => String)
  idCardWanted: string;

  @ApiProperty({
    name: 'idCard',
    description: 'Id of the card the creator is giving',
    example: '61a3c03e334ac0413a10014',
  })
  @Expose()
  @Type(() => String)
  idCard: string;

  /**
   * Class constructor
   *
   * @param partial data to insert in object instance
   */
  constructor(partial: Partial<TradeEntity>) {
    Object.assign(this, partial);
  }
}
