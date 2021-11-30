import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { defaultIfEmpty, from, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { User, UserDocument } from '../../users/schemas/user.schema';
import { CreateTradeDto } from '../dto/create-trade.dto';
import { UpdateUserDto } from '../../users/dto/update-user.dto';
import { PatchTradeDto } from '../dto/patch-trade.dto';
import { Trade, TradeDocument } from '../schemas/trade.shema';

@Injectable()
export class TradesDao {
  /**
   * Class constructor
   *
   * @param {Model<TradeDocument>} _tradeModel instance of the model representing a trade
   */
  constructor(
    @InjectModel(Trade.name)
    private readonly _tradeModel: Model<TradeDocument>,
  ) {}

  /**
   * Call mongoose method, call toJSON on each result and returns TradeModel[] or undefined
   *
   * @return {Observable<Trade[] | void>}
   */
  find = (): Observable<Trade[] | void> =>
    from(this._tradeModel.find({})).pipe(
      filter((docs: TradeDocument[]) => !!docs && docs.length > 0),
      map((docs: TradeDocument[]) =>
        docs.map((_: TradeDocument) => _.toJSON()),
      ),
      defaultIfEmpty(undefined),
    );

  /**
   * Returns one trade of the list matching id in parameter
   *
   * @param {string} id of the trade in the db
   *
   * @return {Observable<Trade | void>}
   */
  findById = (id: string): Observable<Trade | void> =>
    from(this._tradeModel.findById(id)).pipe(
      filter((doc: TradeDocument) => !!doc),
      map((doc: TradeDocument) => doc.toJSON()),
      defaultIfEmpty(undefined),
    );

  /**
   * Call mongoose method, call toJSON on each result and returns TradeModel[] or undefined
   *
   * @return {Observable<Trade[] | void>}
   */
  findByUserWaitingId = (id: string): Observable<Trade[] | void> =>
    from(this._tradeModel.find({ idUserWaiting: id })).pipe(
      filter((docs: TradeDocument[]) => !!docs && docs.length > 0),
      map((docs: TradeDocument[]) =>
        docs.map((_: TradeDocument) => _.toJSON()),
      ),
      defaultIfEmpty(undefined),
    );

  /**
   * Call mongoose method, call toJSON on each result and returns TradeModel[] or undefined
   *
   * @return {Observable<Trade[] | void>}
   */
  findBySecondUserId = (id: string): Observable<Trade[] | void> =>
    from(this._tradeModel.find({ idUser: id })).pipe(
      filter((docs: TradeDocument[]) => !!docs && docs.length > 0),
      map((docs: TradeDocument[]) =>
        docs.map((_: TradeDocument) => _.toJSON()),
      ),
      defaultIfEmpty(undefined),
    );

  /**
   * Check if trade already exists with index and add it in trade list
   *
   * @param {CreateTradeDto} trade to create
   *
   * @return {Observable<Trade>}
   */
  create = (notification: CreateTradeDto): Observable<Trade> =>
    from(new this._tradeModel(notification).save()).pipe(
      map((doc: TradeDocument) => doc.toJSON()),
    );

  /**
   *
   * Update a trade in trade list
   *
   * @param {string} id
   * @param {PatchTradeDto} trade
   *
   * @return {Observable<Trade | void>}
   */
  patch = (id: string, tradeDto: PatchTradeDto): Observable<Trade | void> =>
    from(
      this._tradeModel.findByIdAndUpdate(id, tradeDto, {
        new: true,
        runValidators: true,
      }),
    ).pipe(
      filter((doc: TradeDocument) => !!doc),
      map((doc: TradeDocument) => doc.toJSON()),
      defaultIfEmpty(undefined),
    );

  /**
   * Delete a trade in trade list
   *
   * @param {string} id
   *
   * @return {Observable<Trade | void>}
   */
  findByIdAndRemove = (id: string): Observable<Trade | void> =>
    from(this._tradeModel.findByIdAndRemove(id)).pipe(
      filter((doc: TradeDocument) => !!doc),
      map((doc: TradeDocument) => doc.toJSON()),
      defaultIfEmpty(undefined),
    );
}
