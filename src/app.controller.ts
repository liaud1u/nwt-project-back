import { Controller, Post, UseGuards, Body, Get, Logger } from '@nestjs/common';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { HandlerBody } from './auth/validators/handler-body';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { Observable } from 'rxjs';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  login(@Body() req: HandlerBody): Observable<any> {
    return this.authService.login(req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('auth/test')
  getProfile(@Body() req) {
    Logger.log(req);
    return 'IT WORKS WELL DONE';
  }
}
