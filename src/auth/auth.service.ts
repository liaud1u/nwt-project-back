import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Observable } from 'rxjs';
import { UserEntity } from '../users/entities/user.entity';
import { map } from 'rxjs/operators';
import { JwtService } from '@nestjs/jwt';
import { HandlerBody } from './validators/handler-body';

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
        map((_: UserEntity) => (!!_ && _.password === pass ? _ : undefined)),
      );
  }

  async login(user: HandlerBody) {
    const payload = { username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
