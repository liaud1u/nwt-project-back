import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class NotificationEntity {
  @ApiProperty({
    name: 'id',
    description: 'Unique identifier in the database',
    example: '61a53416334ac0413ea1001f',
  })
  @Expose()
  @Type(() => String)
  id: string;

  @ApiProperty({
    name: 'read',
    description: 'Notification is read',
    example: true,
  })
  @Expose()
  @Type(() => Boolean)
  read: boolean;

  @ApiProperty({
    name: 'creationTime',
    description: 'Notification creation date',
    example: '2021-11-29T21:36:21.000+0100',
  })
  @Expose()
  @Type(() => String)
  creationTime: string;

  @ApiProperty({
    name: 'idUser',
    description: 'Id of the owner of the notification',
    example: '61a386bb334ac0413a10011',
  })
  @Expose()
  @Type(() => String)
  idUser: string;

  @ApiProperty({
    name: 'type',
    description: 'Type of the notification',
    example: 'notif',
  })
  @Expose()
  @Type(() => String)
  type: string;

  @ApiProperty({
    name: 'content',
    description: 'Content of the notification',
    example: 'Hello, I am a notification',
  })
  @Expose()
  @Type(() => String)
  content: string;

  @ApiProperty({
    name: 'accepted',
    description: 'Notification accepted',
    example: false,
  })
  @Expose()
  @Type(() => Boolean)
  accepted: boolean;

  /**
   * Class constructor
   *
   * @param partial data to insert in object instance
   */
  constructor(partial: Partial<NotificationEntity>) {
    Object.assign(this, partial);
  }
}
