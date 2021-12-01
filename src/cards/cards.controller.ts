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
  ApiBearerAuth,
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
import { CardsService } from './cards.service';
import { Observable } from 'rxjs';
import { CardEntity } from './entities/card.entity';
import { HandlerParams } from '../users/validators/handler-params';
import { LevelParams } from './validators/level-params';
import { CollectionEntity } from '../collections/entities/collection.entity';
import { UserEntity } from '../users/entities/user.entity';
import { CreateCardDto } from './dto/create-card.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('cards')
@Controller('cards')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(HttpInterceptor)
export class CardsController {
  /**
   * Class constructor
   *
   * @param _cardsService {CardsService} instance of the service managing cards
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
   * Handler to answer to GET /cards/level/:level route
   *
   * @param {HandlerParams} params list of route params to take card level
   *
   * @returns Observable<CardEntity[]>
   */
  @ApiOkResponse({
    description: 'Returns cards for the given level',
    type: CardEntity,
    isArray: true,
  })
  @ApiNotFoundResponse({
    description: "Cards with the given level doesn't exist in the database",
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
    return this._cardsService.findByLevel(params.level);
  }

  /**
   * Handler to answer to POST /cards route
   *
   * @param createCardDto data to create
   *
   * @returns Observable<CardEntity>
   */
  @ApiCreatedResponse({
    description: 'The card has been successfully created',
    type: UserEntity,
  })
  @ApiConflictResponse({
    description: 'The card already exists in the database',
  })
  @ApiBadRequestResponse({ description: 'Payload provided is not good' })
  @ApiUnprocessableEntityResponse({
    description: "The request can't be performed in the database",
  })
  @ApiBody({
    description: 'Payload to create a new card',
    type: CreateCardDto,
  })
  @Post()
  create(@Body() createCardDto: CreateCardDto): Observable<CardEntity> {
    return this._cardsService.create(createCardDto);
  }

  /**
   * Handler to answer to DELETE /cards/:id route
   *
   * @param {HandlerParams} params list of route params to take card id
   *
   * @returns Observable<void>
   */
  @ApiNoContentResponse({
    description: 'The card has been successfully deleted',
  })
  @ApiNotFoundResponse({
    description: 'Card with the given "id" doesn\'t exist in the database',
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
    description: 'Unique identifier of the card in the database',
    type: String,
    allowEmptyValue: false,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param() params: HandlerParams): Observable<void> {
    return this._cardsService.delete(params.id);
  }

  /**
   * Handler to answer to PUT /cards/user/:id/roll route
   *
   * @param {HandlerParams} params list of route params to take card id
   *
   * @returns Observable<CardEntity[]>
   */
  @ApiOkResponse({
    description: 'Returns the list of collections rerolled by the users',
    type: CollectionEntity,
    isArray: true,
  })
  @ApiNotFoundResponse({
    description: "The users with the given id wasn't found in the database",
  })
  @ApiBadRequestResponse({ description: 'Parameter provided is not good' })
  @ApiUnprocessableEntityResponse({
    description: "The request can't be performed in the database",
  })
  @ApiParam({
    name: 'id',
    description: 'yes',
    type: String,
    allowEmptyValue: false,
  })
  @Put('/user/:id/roll')
  roll(@Param() params: HandlerParams): Observable<CollectionEntity[] | void> {
    return this._cardsService.roll(params.id);
  }
}
