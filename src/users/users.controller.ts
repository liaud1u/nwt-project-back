import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HttpInterceptor } from '../interceptors/http.interceptor';
import { UsersService } from './users.service';
import { Observable } from 'rxjs';
import { UserEntity } from './entities/user.entity';
import { HandlerParams } from './validators/handler-params';

@ApiTags('users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(HttpInterceptor)
export class UsersController {
  /**
   * Class constructor
   * @param _usersService
   */
  constructor(private readonly _usersService: UsersService) {}

  @Get(':id')
  findOne(@Param() params: HandlerParams): Observable<UserEntity> {
    return this._usersService.findOne(params.id);
  }
}
