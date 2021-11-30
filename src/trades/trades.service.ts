import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { catchError, defaultIfEmpty, Observable, of, throwError } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { TradesDao } from './dao/trades.dao';
import { TradeEntity } from './entities/trade.entity';
import { UserEntity } from '../users/entities/user.entity';
import { User } from '../users/schemas/user.schema';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CreateTradeDto } from './dto/create-trade.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { PatchTradeDto } from './dto/patch-trade.dto';
import { Trade } from './schemas/trade.shema';
import { Collection } from '../collections/schemas/collection.shema';
import { CollectionsDao } from '../collections/dao/collections.dao';
import { CollectionsService } from '../collections/collections.service';

@Injectable()
export class TradesService {
  constructor(
    private readonly _tradeDao: TradesDao,
    private _collectionService: CollectionsService,
  ) {}

  /**
   * Returns all existing trades in the list
   *
   * @returns {Observable<TradeEntity[] | void>}
   */
  findAll = (): Observable<TradeEntity[] | void> =>
    this._tradeDao.find().pipe(
      filter((_: Trade[]) => !!_),
      map((_: Trade[]) => _.map((__: Trade) => new TradeEntity(__))),
      defaultIfEmpty(undefined),
    );

  /**
   * Returns one trades of the list matching id in parameter
   *
   * @param {string} id of the trade in the db
   *
   * @return {Observable<Trade | void>}
   */
  findById = (id: string): Observable<TradeEntity | void> =>
    this._tradeDao.findById(id).pipe(
      catchError((e) =>
        throwError(() => new UnprocessableEntityException(e.message)),
      ),
      mergeMap((_: Trade) =>
        !!_
          ? of(new TradeEntity(_))
          : throwError(
              () => new NotFoundException(`trade with id '${id}' not found`),
            ),
      ),
    );

  /**
   * Returns array of trades where user matching id in parameter  is waiting
   *
   * @param {string} id of the user in the db
   *
   * @return {Observable<Trade[] | void>}
   */
  findAllWaitingUserById = (id: string): Observable<TradeEntity[] | void> =>
    this._tradeDao.findByUserWaitingId(id).pipe(
      filter((_: Trade[]) => !!_),
      map((_: Trade[]) => _.map((__: Trade) => new TradeEntity(__))),
      defaultIfEmpty(undefined),
    );

  /**
   * Returns array of trades of user matching id in parameter need to accept
   *
   * @param {string} id of the user in the db
   *
   * @return {Observable<Trade[] | void>}
   */
  findAllSecondUserById = (id: string): Observable<TradeEntity[] | void> =>
    this._tradeDao.findBySecondUserId(id).pipe(
      filter((_: Trade[]) => !!_),
      map((_: Trade[]) => _.map((__: Trade) => new TradeEntity(__))),
      defaultIfEmpty(undefined),
    );

  /**
   * Returns one trades of the list matching id in parameter
   *
   * @param {string} id of the trades
   *
   * @returns {Observable<TradeEntity>}
   */
  findOne = (id: string): Observable<TradeEntity | void> =>
    this._tradeDao.findById(id).pipe(
      catchError((e) =>
        throwError(() => new UnprocessableEntityException(e.message)),
      ),
      mergeMap((_: Trade) =>
        !!_
          ? of(new TradeEntity(_))
          : throwError(
              () => new NotFoundException(`trades with id '${id}' not found`),
            ),
      ),
    );

  /**
   * Check if trade already exists and add it in trades list
   *
   * @param trade to create
   *
   * @returns {Observable<TradeEntity>}
   */
  create(tradeDto: CreateTradeDto): Observable<TradeEntity> {
    console.log('Update waiting amount ');

    this._collectionService.addCardWaitingToUser(
      tradeDto.idUserWaiting,
      tradeDto.idCard,
    );
    this._collectionService.addCardWaitingToUser(
      tradeDto.idUser,
      tradeDto.idCardWanted,
    );

    return this._tradeDao
      .create(tradeDto)

      .pipe(
        catchError((e) =>
          e.code === 11000
            ? throwError(() => new ConflictException(`Id trade already exists`))
            : throwError(() => new UnprocessableEntityException(e.message)),
        ),

        map((_: Trade) => new TradeEntity(_)),
      );
  }

  /**
   * Update a trade in trades list
   *
   * @param {string} id of the trade to update
   * @param trade data to update
   *
   * @returns {Observable<TradeEntity>}
   */
  patch(id: string, tradeDto: PatchTradeDto): Observable<TradeEntity> {
    return this._tradeDao.patch(id, tradeDto).pipe(
      catchError((e) =>
        e.code === 11000
          ? throwError(() => new ConflictException(`Id trade already exists`))
          : throwError(() => new UnprocessableEntityException(e.message)),
      ),
      mergeMap((_: Trade) =>
        !!_
          ? of(new TradeEntity(_))
          : throwError(
              () => new NotFoundException(`Trade with id '${id}' not found`),
            ),
      ),
    );
  }

  /**
   * Deletes one trade in trades list
   *
   * @param {string} id of the trade to delete
   *
   * @returns {Observable<void>}
   */
  delete = (id: string): Observable<void> =>
    this._tradeDao.findByIdAndRemove(id).pipe(
      catchError((e) =>
        throwError(() => new UnprocessableEntityException(e.message)),
      ),
      mergeMap((_: Trade) =>
        !!_
          ? of(undefined)
          : throwError(
              () => new NotFoundException(`Trade with id '${id}' not found`),
            ),
      ),
    );

  accept(id: string) {
    this.findById(id).subscribe((data: TradeEntity) => {
      this._collectionService.removeCardWaitingToUser(
        data.idUser,
        data.idCardWanted,
      );
      this._collectionService.removeCardWaitingToUser(
        data.idUserWaiting,
        data.idCard,
      );
      this._collectionService.addCardToUser(data.idUser, data.idCard);
      this._collectionService.addCardToUser(
        data.idUserWaiting,
        data.idCardWanted,
      );
    });
  }

  decline(id: string) {
    this.findById(id).subscribe((dataTrade: TradeEntity) => {
      this._collectionService
        .removeCardWaitingToUser(dataTrade.idUser, dataTrade.idCardWanted)
        .subscribe((data) => {
          this._collectionService
            .removeCardWaitingToUser(dataTrade.idUserWaiting, dataTrade.idCard)
            .subscribe((data) => {
              this.delete(id).subscribe();
            });
        });
    });
  }
}
