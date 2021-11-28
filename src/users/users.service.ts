import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { catchError, from, Observable, of, throwError } from 'rxjs';
import { UserEntity } from './entities/user.entity';
import { map, mergeMap } from 'rxjs/operators';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersDao } from './dao/users.dao';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(private readonly _usersDao: UsersDao) {}

  findOne = (id: string): Observable<UserEntity | void> =>
    this._usersDao.findById(id).pipe(
      catchError((e) =>
        throwError(() => new UnprocessableEntityException(e.message)),
      ),
      mergeMap((_: User) =>
        !!_
          ? of(new UserEntity(_))
          : throwError(
              () => new NotFoundException(`User with id '${id}' not found`),
            ),
      ),
    );

  findOneByUsername = (username: string): Observable<UserEntity> =>
    this._usersDao.findByUsername(username).pipe(
      catchError((e) =>
        throwError(() => new UnprocessableEntityException(e.message)),
      ),
      mergeMap((_: User) =>
        !!_
          ? of(new UserEntity(_))
          : throwError(
              () =>
                new NotFoundException(
                  `User with username '${username}' not found`,
                ),
            ),
      ),
    );

  create = (user: CreateUserDto): Observable<UserEntity> =>
    this._addUser(user).pipe(
      mergeMap((_: CreateUserDto) => this._usersDao.save(_)),
      catchError((e) =>
        e.code === 11000
          ? throwError(
              () =>
                new ConflictException(
                  `User with username '${user.username}' or email '${user.email}' already exists`,
                ),
            )
          : throwError(() => new UnprocessableEntityException(e.message)),
      ),
      map((_: User) => new UserEntity(_)),
    );

  update = (id: string, user: UpdateUserDto) =>
    this._modifyUser(id, user).pipe(
      catchError((e) =>
        e.code === 11000
          ? throwError(
              () =>
                new ConflictException(
                  `User with username '${user.username}' or email '${user.email}' already exists`,
                ),
            )
          : throwError(() => new UnprocessableEntityException(e.message)),
      ),
      mergeMap((_: User) =>
        !!_
          ? of(new UserEntity(_))
          : throwError(
              () => new NotFoundException(`People with id '${id}' not found`),
            ),
      ),
    );

  delete = (id: string): Observable<void> =>
    this._usersDao.findByIdAndRemove(id).pipe(
      catchError((e) =>
        throwError(() => new UnprocessableEntityException(e.message)),
      ),
      mergeMap((_: User) =>
        !!_
          ? of(undefined)
          : throwError(
              () => new NotFoundException(`User with id '${id}' not found`),
            ),
      ),
    );

  /**
   * Add user with good data in users list
   *
   * @param user to add
   *
   * @returns {Observable<CreateUserDto>}
   *
   * @private
   */
  private _addUser = (user: CreateUserDto): Observable<CreateUserDto> =>
    of({
      ...user,
      birthDate: this._parseDate(user.birthDate),
      // photo: 'https://randomuser.me/api/portraits/lego/6.jpg',
    }).pipe(mergeMap((_: CreateUserDto) => this.hashPassword(_)));

  /**
   * Hash the password of the new user
   *
   * @param user with password to hash
   *
   * @returns {Observable<CreateUserDto>}
   *
   * @private
   */
  private hashPassword = (user: CreateUserDto): Observable<CreateUserDto> =>
    from(
      bcrypt.hash(user.password, 10).then((value) => {
        user.password = value;
        return user;
      }),
    );

  private updatePassword = (user: UpdateUserDto): Observable<UpdateUserDto> =>
    from(
      bcrypt.hash(user.password, 10).then((value) => {
        user.password = value;
        return user;
      }),
    );

  /**
   * Function to parse date and return timestamp
   *
   * @param {string} date to parse
   *
   * @returns {number} timestamp
   *
   * @private
   */
  private _parseDate = (date: string): number => {
    return new Date(date).getTime();
  };

  private _modifyUser(
    id: string,
    user: UpdateUserDto,
  ): Observable<User | void> {
    return this.updatePassword(user).pipe(
      mergeMap((_: UpdateUserDto) => this._usersDao.findByIdAndUpdate(id, _)),
    );
  }
}
