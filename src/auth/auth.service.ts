import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { mergeMap, Observable, of } from 'rxjs';
import { UserEntity } from '../users/entities/user.entity';
import { map } from 'rxjs/operators';
import { JwtService } from '@nestjs/jwt';
import { HandlerBody } from './validators/handler-body';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  /**
   * Constructor of a AuthService
   * @param _usersService {UsersService} instance of the service manipulating Users
   * @param _jwtService {JwtService} instance of the service manipulating Jwt
   */
  constructor(
    private _usersService: UsersService,
    private _jwtService: JwtService,
  ) {}

  /**
   * Check if the user exists and if the password matches the one in db
   *
   * @param username {string} username of the user
   * @param pass {string} password of the user
   *
   * @returns {Observable<UserEntity>}
   */
  validateUser(username: string, pass: string): Observable<UserEntity | void> {
    return this._usersService
      .findOneByUsername(username)
      .pipe(
        map((_: UserEntity) =>
          !!_ && bcrypt.compareSync(pass, _.password) ? _ : undefined,
        ),
      );
  }

  /**
   * Login the user and send the token associated to it
   *
   * @param param {HandlerBody} to login the user in the database
   *
   * @returns {Observable<UserEntity>}
   */
  login(param: HandlerBody): Observable<any> {
    const payload = { username: param.username };
    return this._usersService
      .findOneByUsername(param.username)
      .pipe(
        mergeMap((_: UserEntity) =>
          this.addTokenAndRemovePassword(_, this._jwtService.sign(payload)),
        ),
      );
  }

  /**
   * Add the token to the response and remove the password
   *
   * @param user {UserEntity} logged
   * @param token {string} token we want to add
   *
   * @returns {Observable<any>}
   */
  private addTokenAndRemovePassword(
    user: UserEntity,
    token: string,
  ): Observable<any> {
    return of({
      ...user,
      access_token: token,
      password: undefined, // We remove the password
    });
  }
}
