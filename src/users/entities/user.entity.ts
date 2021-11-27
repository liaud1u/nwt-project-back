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
    example: 'AAAA123',
  })
  @Exclude()
  @Type(() => String)
  password: string;

  @ApiProperty({
    name: 'pseudo',
    description: 'Unique pseudo of the user',
    example: 'Jean Cristhobaldo',
  })
  @Expose()
  @Type(() => String)
  pseudo: string;

  @ApiProperty({
    name: 'firstname',
    description: 'Firstname',
    example: 'Mclaughlin',
  })
  @Expose()
  @Type(() => String)
  firstname: string;

  @ApiProperty({
    name: 'lastname',
    description: 'Lastname',
    example: 'Cochran',
  })
  @Expose()
  @Type(() => String)
  lastname: string;

  @ApiProperty({
    name: 'email',
    description: 'Email',
    example: 'Mclaughlin.Cochran@undefined.com',
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
    example: '101343600000',
  })
  @Expose()
  @Type(() => Number)
  birthDate: number;

  /**
   * Class constructor
   *
   * @param partial data to insert in object instance
   */
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
