import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  catchError,
  defaultIfEmpty,
  from,
  Observable,
  of,
  throwError,
} from 'rxjs';
import { UserEntity } from './entities/user.entity';
import { filter, map, mergeMap } from 'rxjs/operators';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersDao } from './dao/users.dao';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(private readonly _usersDao: UsersDao) {}

  /**
   * Returns all existing users in the list
   *
   * @returns {Observable<UserEntity[] | void>}
   */
  findAll = (): Observable<UserEntity[] | void> =>
    this._usersDao.find().pipe(
      filter((_: User[]) => !!_),
      map((_: User[]) => _.map((__: User) => new UserEntity(__))),
      defaultIfEmpty(undefined),
    );

  /**
   * Returns one user of the list matching id in parameter
   *
   * @param {string} id of the user
   *
   * @returns {Observable<UserEntity>}
   */
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

  /**
   * Returns one user of the list matching username in parameter
   *
   * @param {string} username of the user
   *
   * @returns {Observable<UserEntity>}
   */
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

  /**
   * Check if user already exists and add it in users list
   *
   * @param user to create
   *
   * @returns {Observable<UserEntity>}
   */
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

  /**
   * Update a user in users list
   *
   * @param {string} id of the user to update
   * @param user data to update
   *
   * @returns {Observable<UserEntity>}
   */
  update(id: string, user: UpdateUserDto): Observable<UserEntity> {
    return this._modifyUser(id, user).pipe(
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
  }

  /**
   * Deletes one user in users list
   *
   * @param {string} id of the user to delete
   *
   * @returns {Observable<void>}
   */
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

  /**
   * Hash the password of the user
   *
   * @param user with password to hash
   *
   * @returns {Observable<UpdateUserDto>}
   *
   * @private
   */
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

  /**
   * Adapt user's info and send it to the database
   *
   * @param id of the user
   * @param user we are modifying
   *
   * @returns {Observable<User | void>}
   *
   * @private
   */
  private _modifyUser(
    id: string,
    user: UpdateUserDto,
  ): Observable<User | void> {
    return this.updatePassword(user).pipe(
      mergeMap((_: UpdateUserDto) => this._usersDao.findByIdAndUpdate(id, _)),
    );
  }
}
