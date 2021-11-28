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
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  validateUser(username: string, pass: string): Observable<UserEntity> {
    return this.usersService
      .findOneByUsername(username)
      .pipe(
        map((_: UserEntity) =>
          !!_ && bcrypt.compareSync(pass, _.password) ? _ : undefined,
        ),
      );
  }

  login(user: HandlerBody): Observable<any> {
    const payload = { username: user.username };
    return this.usersService
      .findOneByUsername(user.username)
      .pipe(
        mergeMap((_: UserEntity) =>
          this.addToken(_, this.jwtService.sign(payload)),
        ),
      );
  }

  private addToken(user: UserEntity, token: string): Observable<any> {
    return of({
      ...user,
      access_token: token,
      password: undefined, // We remove the password
    });
  }
}
