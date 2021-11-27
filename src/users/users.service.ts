import { Injectable, NotFoundException } from '@nestjs/common';
import { find, from, Observable, of, throwError } from 'rxjs';
import { UserEntity } from './entities/user.entity';
import { mergeMap } from 'rxjs/operators';
import { User } from './users.types';
import { USERS } from '../data/users';

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
}
