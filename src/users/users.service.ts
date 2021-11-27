import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { find, findIndex, from, Observable, of, throwError } from 'rxjs';
import { UserEntity } from './entities/user.entity';
import { map, mergeMap, tap } from 'rxjs/operators';
import { User } from './users.types';
import { USERS } from '../data/users';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private _users: User[];

  constructor() {
    this._users = [].concat(USERS).map((user) => ({
      ...user,
      birthDate: this._parseDate(user.birthDate),
    }));
  }

  findOne = (id: string): Observable<UserEntity> =>
    from(this._users).pipe(
      find((_: User) => _.id === id),
      mergeMap((_: User) =>
        !!_
          ? of(new UserEntity(_))
          : throwError(
              () => new NotFoundException(`User with id '${id}' not found`),
            ),
      ),
    );

  findOneByUsername = (username: string): Observable<UserEntity> =>
    from(this._users).pipe(
      find((_: User) => _.username === username),
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

  private _parseDate = (date: string): number => {
    const dates = date.split('/');
    return new Date(dates[2] + '/' + dates[1] + '/' + dates[0]).getTime();
  };

  create = (user: CreateUserDto): Observable<UserEntity> =>
    from(this._users).pipe(
      find(
        (_: User) =>
          _.username.toLowerCase() === user.username.toLowerCase() ||
          _.email.toLowerCase() === user.email.toLowerCase(),
      ),
      mergeMap((_: User) =>
        !!_
          ? throwError(
              () =>
                new ConflictException(
                  `Someone with username '${user.username}' or email '${user.email}' already exists`,
                ),
            )
          : this._addUser(user),
      ),
    );

  private _addUser = (user: CreateUserDto): Observable<UserEntity> =>
    of({
      ...user,
      id: this._createId(),
      birthDate: this._parseDate(user.birthDate),
    }).pipe(
      mergeMap((_: User) => this.hashPassword(_)),
      tap((_: User) => (this._users = this._users.concat(_))),
      map((_: User) => new UserEntity(_)),
    );

  private hashPassword = (user: User): Observable<User> =>
    from(
      bcrypt.hash(user.password, 10).then((value) => {
        user.password = value;
        return user;
      }),
    );

  private _createId = (): string => `${new Date().getTime()}`;

  update = (id: string, user: UpdateUserDto) =>
    from(this._users).pipe(
      find(
        (_: User) =>
          _.lastname.toLowerCase() === user.lastname.toLowerCase() &&
          _.firstname.toLowerCase() === user.firstname.toLowerCase() &&
          _.id.toLowerCase() !== id.toLowerCase(),
      ),
      mergeMap((_: User) =>
        !!_
          ? throwError(
              () =>
                new ConflictException(
                  `Someone with username '${user.username}' or email '${user.email}' already exists`,
                ),
            )
          : this._findPeopleIndexOfList(id),
      ),
      tap((index: number) => Object.assign(this._users[index], user)),
      map((index: number) => new UserEntity(this._users[index])),
    );

  delete = (id: string): Observable<void> =>
    this._findPeopleIndexOfList(id).pipe(
      tap((_: number) => this._users.splice(_, 1)),
      map(() => undefined),
    );

  private _findPeopleIndexOfList = (id: string): Observable<number> =>
    from(this._users).pipe(
      findIndex((_: User) => _.id === id),
      mergeMap((index: number) =>
        index > -1
          ? of(index)
          : throwError(
              () => new NotFoundException(`User with id '${id}' not found`),
            ),
      ),
    );
}
