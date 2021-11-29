import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { UserEntity } from '../../users/entities/user.entity';
import { lastValueFrom, mergeMap, of, throwError } from 'rxjs';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  /**
   * Validate the user and the password to login
   *
   * @param username of the user
   * @param password of the user
   *
   * @returns Promise<UserEntity | void>
   */
  async validate(
    username: string,
    password: string,
  ): Promise<UserEntity | void> {
    return lastValueFrom(
      this.authService
        .validateUser(username, password)
        .pipe(
          mergeMap((_: UserEntity) =>
            !!_ ? of(_) : throwError(() => new UnauthorizedException()),
          ),
        ),
    );
  }
}
