import {
  Controller,
  Post,
  UseGuards,
  Body,
  Get,
  Logger,
  UseInterceptors,
} from '@nestjs/common';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { HandlerBody } from './auth/validators/handler-body';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { Observable, of } from 'rxjs';
import {
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { HttpInterceptor } from './interceptors/http.interceptor';

@ApiTags('auth')
@Controller()
@UseInterceptors(HttpInterceptor)
export class AppController {
  constructor(private authService: AuthService) {}

  /**
   * Handler to answer to POST /auth/login route
   *
   * @param {HandlerParams} body list of route params for username and password
   *
   * @returns Observable<UserEntity>
   */
  @ApiOkResponse({
    description:
      'Returns the user for the given "username" and the token_access to stay connected',
  })
  @ApiNotFoundResponse({
    description:
      'User with the given "username" doesn\'t exist in the database',
  })
  @ApiUnauthorizedResponse({
    description:
      "The password doesn't match the one in the database or the parameters are wrong",
  })
  @ApiBody({
    description: 'Payload to login (username and password)',
    type: HandlerBody,
  })
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  login(@Body() body: HandlerBody): Observable<any> {
    return this.authService.login(body);
  }

  /**
   * Route to test if the token is valid
   *
   * @param {HandlerParams} req list of route params to take token
   *
   * @returns Observable<string>
   */
  @ApiOkResponse({
    description: 'Return "IT WORKS, WELL DONE"',
  })
  @ApiUnauthorizedResponse({
    description: 'The token given is not working or is wrong',
  })
  @UseGuards(JwtAuthGuard)
  @Get('auth/test')
  getProfile(@Body() req): Observable<string> {
    Logger.log(req);
    return of('IT WORKS, WELL DONE');
  }
}
