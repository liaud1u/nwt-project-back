import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Logger,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { Observable, of } from 'rxjs';
import { CollectionEntity } from './entities/collection.entity';
import { CollectionsService } from './collections.service';
import { HttpInterceptor } from '../interceptors/http.interceptor';
import { UserEntity } from '../users/entities/user.entity';
import { HandlerParams } from '../users/validators/handler-params';

@ApiTags('collections')
@Controller('collections')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(HttpInterceptor)
export class CollectionsController {
  /**
   * Class constructor
   * @param _collectionService
   */
  constructor(private readonly _collectionService: CollectionsService) {}

  /**
   * Handler to answer to GET /collections route
   *
   * @returns Observable<CollectionEntity[] | void>
   */
  @ApiOkResponse({
    description: 'Returns an array of collection',
    type: CollectionEntity,
    isArray: true,
  })
  @ApiNoContentResponse({ description: 'No collection exists in database' })
  @Get()
  findAll(): Observable<CollectionEntity[] | void> {
    return this._collectionService.findAll();
  }

  /**
   * Handler to answer to GET /collections/user/:id route
   *
   * @returns Observable<CollectionEntity[] | void>
   */
  @ApiOkResponse({
    description: 'Returns the array of Collection for the given "id"',
    type: CollectionEntity,
  })
  @ApiNotFoundResponse({
    description: 'No Collections for the specified user ID',
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
  @Get('/users/:id')
  findAllById(
    @Param() params: HandlerParams,
  ): Observable<CollectionEntity[] | void> {
    return this._collectionService.findAllById(params.id);
  }
}
