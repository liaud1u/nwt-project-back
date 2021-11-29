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
}
