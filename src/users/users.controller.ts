import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HttpInterceptor } from '../interceptors/http.interceptor';
import { UsersService } from './users.service';
import { Observable } from 'rxjs';
import { UserEntity } from './entities/user.entity';
import { HandlerParams } from './validators/handler-params';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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
  findOne(@Param() params: HandlerParams): Observable<UserEntity | void> {
    return this._usersService.findOne(params.id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto): Observable<UserEntity> {
    return this._usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param() params: HandlerParams,
    @Body() updateUserDto: UpdateUserDto,
  ): Observable<UserEntity> {
    return this._usersService.update(params.id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param() params: HandlerParams): Observable<void> {
    return this._usersService.delete(params.id);
  }
}
