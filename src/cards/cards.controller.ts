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
import { HttpInterceptor } from '../interceptors/http.interceptor';
import { CardsService } from './cards.service';
import { Observable } from 'rxjs';
import { CardEntity } from './entities/card.entity';
import { HandlerParams } from '../users/validators/handler-params';
import { LevelParams } from './validators/level-params';

@ApiTags('cards')
@Controller('cards')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(HttpInterceptor)
export class CardsController {
  /**
   * Class constructor
   * @param _cardsService
   */
  constructor(private readonly _cardsService: CardsService) {}

  /**
   * Handler to answer to GET /cards route
   *
   * @returns Observable<CardEntity[] | void>
   */
  @ApiOkResponse({
    description: 'Returns an array of card',
    type: CardEntity,
    isArray: true,
  })
  @ApiNoContentResponse({ description: 'No card exists in database' })
  @Get()
  findAll(): Observable<CardEntity[] | void> {
    return this._cardsService.findAll();
  }

  /**
   * Handler to answer to GET /cards/:id route
   *
   * @param {HandlerParams} params list of route params to take card id
   *
   * @returns Observable<CardEntity>
   */
  @ApiOkResponse({
    description: 'Returns the card for the given "id"',
    type: CardEntity,
  })
  @ApiNotFoundResponse({
    description: 'Card with the given "id" doesn\'t exist in the database',
  })
  @ApiBadRequestResponse({ description: 'Parameter provided is not good' })
  @ApiUnprocessableEntityResponse({
    description: "The request can't be performed in the database",
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the card in the database',
    type: String,
    allowEmptyValue: false,
  })
  @Get(':id')
  findById(@Param() params: HandlerParams): Observable<CardEntity | void> {
    return this._cardsService.findById(params.id);
  }

  /**
   * Handler to answer to GET /cards/level/:id route
   *
   * @param {HandlerParams} params list of route params to take card id
   *
   * @returns Observable<CardEntity[]>
   */
  @ApiOkResponse({
    description: 'Returns the card for the given level',
    type: CardEntity,
    isArray: true,
  })
  @ApiNotFoundResponse({
    description: "Card with the given level doesn't exist in the database",
  })
  @ApiBadRequestResponse({ description: 'Parameter provided is not good' })
  @ApiUnprocessableEntityResponse({
    description: "The request can't be performed in the database",
  })
  @ApiNoContentResponse({ description: 'No card found in database' })
  @ApiParam({
    name: 'level',
    description: 'Level of the cards you want',
    type: Number,
    allowEmptyValue: false,
  })
  @Get('level/:level')
  findByLevel(@Param() params: LevelParams): Observable<CardEntity[] | void> {
    Logger.log(params);
    return this._cardsService.findByLevel(params.level);
  }
}
