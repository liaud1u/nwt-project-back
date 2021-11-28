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
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
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

  /**
   * Handler to answer to GET /users/:id route
   *
   * @param {HandlerParams} params list of route params to take user id
   *
   * @returns Observable<UserEntity>
   */
  @ApiOkResponse({
    description: 'Returns the user for the given "id"',
    type: UserEntity,
  })
  @ApiNotFoundResponse({
    description: 'User with the given "id" doesn\'t exist in the database',
  })
  @ApiBadRequestResponse({ description: 'Parameter provided is not good' })
  @ApiUnprocessableEntityResponse({
    description: "The request can't be performed in the database",
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the user in the database',
    type: String,
    allowEmptyValue: false,
  })
  @Get(':id')
  findOne(@Param() params: HandlerParams): Observable<UserEntity | void> {
    return this._usersService.findOne(params.id);
  }

  /**
   * Handler to answer to POST /users route
   *
   * @param createUserDto data to create
   *
   * @returns Observable<UserEntity>
   */
  @ApiCreatedResponse({
    description: 'The user has been successfully created',
    type: UserEntity,
  })
  @ApiConflictResponse({
    description: 'The user already exists in the database',
  })
  @ApiBadRequestResponse({ description: 'Payload provided is not good' })
  @ApiUnprocessableEntityResponse({
    description: "The request can't be performed in the database",
  })
  @ApiBody({
    description: 'Payload to create a new user',
    type: CreateUserDto,
  })
  @Post()
  create(@Body() createUserDto: CreateUserDto): Observable<UserEntity> {
    return this._usersService.create(createUserDto);
  }

  /**
   * Handler to answer to PUT /people/:id route
   *
   * @param {HandlerParams} params list of route params to take user id
   * @param updateUserDto data to update
   *
   * @returns Observable<UserEntity>
   */
  @ApiOkResponse({
    description: 'The user has been successfully updated',
    type: UserEntity,
  })
  @ApiNotFoundResponse({
    description: 'User with the given "id" doesn\'t exist in the database',
  })
  @ApiConflictResponse({
    description: 'The user already exists in the database',
  })
  @ApiBadRequestResponse({
    description: 'Parameter and/or payload provided are not good',
  })
  @ApiUnprocessableEntityResponse({
    description: "The request can't be performed in the database",
  })
  @ApiUnauthorizedResponse({
    description:
      'An access token of the user is required to perform this action',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the user in the database',
    type: String,
    allowEmptyValue: false,
  })
  @ApiBody({ description: 'Payload to update a person', type: UpdateUserDto })
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param() params: HandlerParams,
    @Body() updateUserDto: UpdateUserDto,
  ): Observable<UserEntity> {
    return this._usersService.update(params.id, updateUserDto);
  }

  /**
   * Handler to answer to DELETE /users/:id route
   *
   * @param {HandlerParams} params list of route params to take user id
   *
   * @returns Observable<void>
   */
  @ApiNoContentResponse({
    description: 'The user has been successfully deleted',
  })
  @ApiNotFoundResponse({
    description: 'User with the given "id" doesn\'t exist in the database',
  })
  @ApiBadRequestResponse({ description: 'Parameter provided is not good' })
  @ApiUnprocessableEntityResponse({
    description: "The request can't be performed in the database",
  })
  @ApiUnauthorizedResponse({
    description:
      'An access token of the user is required to perform this action',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the user in the database',
    type: String,
    allowEmptyValue: false,
  })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param() params: HandlerParams): Observable<void> {
    return this._usersService.delete(params.id);
  }
}
