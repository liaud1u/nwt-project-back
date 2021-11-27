import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Observable } from 'rxjs';
import { UserEntity } from '../users/entities/user.entity';
import { map } from 'rxjs/operators';
import { JwtService } from '@nestjs/jwt';
import { HandlerRequests } from './validators/handle.request';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  validateUser(pseudo: string, pass: string): Observable<UserEntity> {
    return this.usersService
      .findOneByPseudo(pseudo)
      .pipe(
        map((_: UserEntity) => (!!_ && _.password === pass ? _ : undefined)),
      );
  }

  async login(user: HandlerRequests) {
    const payload = { pseudo: user.username, sub: user.password };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
