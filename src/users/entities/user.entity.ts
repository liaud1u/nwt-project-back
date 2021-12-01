import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class UserEntity {
  @ApiProperty({
    name: 'id',
    description: 'Unique identifier in the database',
    example: '5764cd4dc378a38ecd387737',
  })
  @Expose()
  @Type(() => String)
  id: string;

  @ApiProperty({
    name: 'password',
    description: "User's password in the database",
    example: 'HTeu4ud.S+@84/6',
  })
  @Exclude()
  @Type(() => String)
  password: string;

  @ApiProperty({
    name: 'username',
    description: 'Unique username of the user',
    example: 'jean',
  })
  @Expose()
  @Type(() => String)
  username: string;

  @ApiProperty({
    name: 'firstname',
    description: 'Firstname',
    example: 'Jean',
  })
  @Expose()
  @Type(() => String)
  firstname: string;

  @ApiProperty({
    name: 'lastname',
    description: 'Lastname',
    example: 'Cristho',
  })
  @Expose()
  @Type(() => String)
  lastname: string;

  @ApiProperty({
    name: 'email',
    description: 'Email',
    example: 'jean.cristho@mail.com',
  })
  @Expose()
  @Type(() => String)
  email: string;

  @ApiProperty({
    name: 'photo',
    description: 'Photo URL',
    example: 'https://randomuser.me/portraits/men/55.jpg',
  })
  @Expose()
  @Type(() => String)
  photo: string;

  @ApiProperty({
    name: 'birthDate',
    description: 'Birthdate in timestamp format',
    example: '2000-12-31',
  })
  @Expose()
  @Type(() => Date)
  birthDate: any;

  @ApiProperty({
    name: 'lastRollDate',
    description: 'Last Time the Users has rolled cards',
    example: '2000-12-31',
  })
  @Expose()
  @Type(() => Date)
  lastRollDate: any;

  /**
   * Class constructor
   *
   * @param partial data to insert in object instance
   */
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
