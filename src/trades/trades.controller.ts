import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
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
import { TradeEntity } from './entities/trade.entity';
import { TradesService } from './trades.service';
import { HttpInterceptor } from '../interceptors/http.interceptor';
import { UserEntity } from '../users/entities/user.entity';
import { HandlerParams } from '../users/validators/handler-params';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CreateTradeDto } from './dto/create-trade.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PatchTradeDto } from './dto/patch-trade.dto';

@ApiTags('trades')
@Controller('trades')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(HttpInterceptor)
export class TradesController {
  /**
   * Class constructor
   * @param _tradeModel
   */
  constructor(private readonly _tradeModel: TradesService) {}

  /**
   * Handler to answer to GET /trades route
   *
   * @returns Observable<TradeEntity[] | void>
   */
  @ApiOkResponse({
    description: 'Returns an array of trades',
    type: TradeEntity,
    isArray: true,
  })
  @ApiNoContentResponse({ description: 'No trade exists in database' })
  @Get()
  findAll(): Observable<TradeEntity[] | void> {
    return this._tradeModel.findAll();
  }

  /**
   * Handler to answer to GET /trades/users/waiting/:id route
   *
   * @returns Observable<TradeEntity[] | void>
   */
  @ApiOkResponse({
    description:
      'Returns the array of trades for the given "id" wich is in a waiting state',
    type: TradeEntity,
  })
  @ApiNotFoundResponse({
    description: 'No trades for the specified user ID',
  })
  @ApiBadRequestResponse({ description: 'Parameter provided is not good' })
  @ApiUnprocessableEntityResponse({
    description: "The request can't be performed in the database",
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the waiting user in the database',
    type: String,
    allowEmptyValue: false,
  })
  @Get('/users/waiting/:id')
  findAllWaitingById(
    @Param() params: HandlerParams,
  ): Observable<TradeEntity[] | void> {
    return this._tradeModel.findAllWaitingUserById(params.id);
  }

  /**
   * Handler to answer to GET /trades/users/second/:id route
   *
   * @returns Observable<TradeEntity[] | void>
   */
  @ApiOkResponse({
    description:
      'Returns the array of trades for the given "id" wich is in a response state',
    type: TradeEntity,
  })
  @ApiNotFoundResponse({
    description: 'No trades for the specified user ID',
  })
  @ApiBadRequestResponse({ description: 'Parameter provided is not good' })
  @ApiUnprocessableEntityResponse({
    description: "The request can't be performed in the database",
  })
  @ApiParam({
    name: 'id',
    description:
      'Unique identifier of the response needed user in the database',
    type: String,
    allowEmptyValue: false,
  })
  @Get('/users/second/:id')
  findAllSecondById(
    @Param() params: HandlerParams,
  ): Observable<TradeEntity[] | void> {
    return this._tradeModel.findAllSecondUserById(params.id);
  }

  /**
   * Handler to answer to GET /trades/:id route
   *
   * @param {HandlerParams} params list of route params to take trade id
   *
   * @returns Observable<TradeEntity>
   */
  @ApiOkResponse({
    description: 'Returns the trade for the given "id"',
    type: TradeEntity,
  })
  @ApiNotFoundResponse({
    description: 'Trade with the given "id" doesn\'t exist in the database',
  })
  @ApiBadRequestResponse({ description: 'Parameter provided is not good' })
  @ApiUnprocessableEntityResponse({
    description: "The request can't be performed in the database",
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the trade in the database',
    type: String,
    allowEmptyValue: false,
  })
  @Get(':id')
  findOne(@Param() params: HandlerParams): Observable<TradeEntity | void> {
    return this._tradeModel.findOne(params.id);
  }

  /**
   * Handler to answer to POST /trades route
   *
   * @param createTradeDto data to create
   *
   * @returns Observable<TradeEntity>
   */
  @ApiCreatedResponse({
    description: 'The trade has been successfully created',
    type: TradeEntity,
  })
  @ApiConflictResponse({
    description: 'The trade already exists in the database',
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
    description: 'Payload to create a new trade',
    type: CreateTradeDto,
  })
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createTradeDto: CreateTradeDto): Observable<TradeEntity> {
    return this._tradeModel.create(createTradeDto);
  }

  /**
   * Handler to answer to PUT /trades/:id route
   *
   * @param {HandlerParams} params list of route params to take trade id
   * @param updateTradeDto data to update
   *
   * @returns Observable<TradeEntity>
   */
  @ApiOkResponse({
    description: 'The trade has been successfully updated',
    type: TradeEntity,
  })
  @ApiNotFoundResponse({
    description: 'Trade with the given "id" doesn\'t exist in the database',
  })
  @ApiConflictResponse({
    description: 'The trade already exists in the database',
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
    description: 'Unique identifier of the trade in the database',
    type: String,
    allowEmptyValue: false,
  })
  @ApiBody({
    description: 'Payload to update a trade',
    type: PatchTradeDto,
  })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  patch(
    @Param() params: HandlerParams,
    @Body() updateTradeDto: PatchTradeDto,
  ): Observable<TradeEntity> {
    return this._tradeModel.patch(params.id, updateTradeDto);
  }

  /**
   * Handler to answer to DELETE /trades/:id route
   *
   * @param {HandlerParams} params list of route params to take trade id
   *
   * @returns Observable<void>
   */
  @ApiNoContentResponse({
    description: 'The trade has been successfully deleted',
  })
  @ApiNotFoundResponse({
    description: 'Trade with the given "id" doesn\'t exist in the database',
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
    description: 'Unique identifier of the trade in the database',
    type: String,
    allowEmptyValue: false,
  })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param() params: HandlerParams): Observable<void> {
    return this._tradeModel.delete(params.id);
  }
}
