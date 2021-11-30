import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Logger,
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
import { Observable, of } from 'rxjs';
import { CollectionEntity } from './entities/collection.entity';
import { CollectionsService } from './collections.service';
import { HttpInterceptor } from '../interceptors/http.interceptor';
import { UserEntity } from '../users/entities/user.entity';
import {
  DoubleHandlerParams,
  HandlerParams,
} from '../users/validators/handler-params';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateCollectionDto } from './dto/update-collection.dto';

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
   * @returns Observable<TradeEntity[] | void>
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
   * @returns Observable<TradeEntity[] | void>
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

  /**
   * Handler to answer to GET /collections/user/tradable/:id route
   *
   * @returns Observable<TradeEntity[] | void>
   */
  @ApiOkResponse({
    description:
      'Returns the array of Collection with tradable card for the given "id"',
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
  @Get('/users/tradable/:id')
  findAllTradableById(
    @Param() params: HandlerParams,
  ): Observable<CollectionEntity[] | void> {
    return this._collectionService.findAllTradableById(params.id);
  }

  /**
   * Handler to answer to GET /collections/:idUser/:idCard route
   *
   * @param {DoubleHandlerParams} params list of route params to take user id
   *
   * @returns Observable<CollectionEntity>
   */
  @ApiOkResponse({
    description: 'Returns the collection for the given "ids"',
    type: CollectionEntity,
  })
  @ApiNotFoundResponse({
    description:
      'Collection with the given "ids" doesn\'t exist in the database',
  })
  @ApiBadRequestResponse({ description: 'Parameter provided is not good' })
  @ApiUnprocessableEntityResponse({
    description: "The request can't be performed in the database",
  })
  @ApiParam({
    name: 'idCard',
    description: 'Unique identifier of the user in the database',
    type: String,
    allowEmptyValue: false,
  })
  @ApiParam({
    name: 'idUser',
    description: 'Unique identifier of the card in the database',
    type: String,
    allowEmptyValue: false,
  })
  @Get(':idUser/:idCard')
  findOneByIdUserIdCard(
    @Param() params: DoubleHandlerParams,
  ): Observable<CollectionEntity[] | void> {
    return this._collectionService.findOneByIdUserIdCard(
      params.idCard,
      params.idUser,
    );
  }

  /**
   * Handler to answer to GET /collections/:id route
   *
   * @param {HandlerParams} params list of route params to take user id
   *
   * @returns Observable<CollectionEntity>
   */
  @ApiOkResponse({
    description: 'Returns the collection for the given "id"',
    type: CollectionEntity,
  })
  @ApiNotFoundResponse({
    description:
      'Collection with the given "id" doesn\'t exist in the database',
  })
  @ApiBadRequestResponse({ description: 'Parameter provided is not good' })
  @ApiUnprocessableEntityResponse({
    description: "The request can't be performed in the database",
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the collection in the database',
    type: String,
    allowEmptyValue: false,
  })
  @Get(':id')
  findOne(@Param() params: HandlerParams): Observable<CollectionEntity | void> {
    return this._collectionService.findOne(params.id);
  }

  /**
   * Handler to answer to POST /collections route
   *
   * @param createCollectionDto data to create
   *
   * @returns Observable<CollectionEntity>
   */
  @ApiCreatedResponse({
    description: 'The collection has been successfully created',
    type: CollectionEntity,
  })
  @ApiConflictResponse({
    description: 'The collection already exists in the database',
  })
  @ApiBadRequestResponse({ description: 'Payload provided is not good' })
  @ApiUnprocessableEntityResponse({
    description: "The request can't be performed in the database",
  })
  @ApiUnauthorizedResponse({
    description:
      'An access token of the user is required to perform this action',
  })
  @ApiBody({
    description: 'Payload to create a new collection',
    type: CreateCollectionDto,
  })
  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createCollectionDto: CreateCollectionDto,
  ): Observable<CollectionEntity> {
    return this._collectionService.create(createCollectionDto);
  }

  /**
   * Handler to answer to PUT /collections/:id route
   *
   * @param {HandlerParams} params list of route params to take collections id
   * @param updateCollectionDto data to update
   *
   * @returns Observable<CollectionEntity>
   */
  @ApiOkResponse({
    description: 'The collections has been successfully updated',
    type: CollectionEntity,
  })
  @ApiNotFoundResponse({
    description:
      'Collections with the given "id" doesn\'t exist in the database',
  })
  @ApiConflictResponse({
    description: 'The collections already exists in the database',
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
    description: 'Unique identifier of the collection in the database',
    type: String,
    allowEmptyValue: false,
  })
  @ApiBody({
    description: 'Payload to update a collection',
    type: UpdateCollectionDto,
  })
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param() params: HandlerParams,
    @Body() updateCollectionDto: UpdateCollectionDto,
  ): Observable<CollectionEntity> {
    return this._collectionService.update(params.id, updateCollectionDto);
  }

  /**
   * Handler to answer to DELETE /collections/:id route
   *
   * @param {HandlerParams} params list of route params to take collection id
   *
   * @returns Observable<void>
   */
  @ApiNoContentResponse({
    description: 'The collection has been successfully deleted',
  })
  @ApiNotFoundResponse({
    description:
      'Collection with the given "id" doesn\'t exist in the database',
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
    description: 'Unique identifier of the collection in the database',
    type: String,
    allowEmptyValue: false,
  })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param() params: HandlerParams): Observable<void> {
    return this._collectionService.delete(params.id);
  }
}
