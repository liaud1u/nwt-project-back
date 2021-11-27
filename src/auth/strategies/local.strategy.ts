import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { UserEntity } from '../../users/entities/user.entity';
import { mergeMap, of, throwError } from 'rxjs';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    return this.authService
      .validateUser(username, password)
      .pipe(
        mergeMap((_: UserEntity) =>
          !!_ ? of(_) : throwError(() => new UnauthorizedException()),
        ),
      )
      .toPromise();
  }
}
