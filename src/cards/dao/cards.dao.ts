import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Card, CardDocument } from '../schemas/card.shema';
import { defaultIfEmpty, from, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable()
export class CardsDao {
  /**
   * Class constructor
   *
   * @param {Model<CardDocument>} _cardModel instance of the model representing a Card
   */
  constructor(
    @InjectModel(Card.name)
    private readonly _cardModel: Model<CardDocument>,
  ) {}

  /**
   * Call mongoose method, call toJSON on each result and returns CardModel[] or undefined
   *
   * @return {Observable<Card[] | void>}
   */
  find = (): Observable<Card[] | void> =>
    from(this._cardModel.find({})).pipe(
      filter((docs: CardDocument[]) => !!docs && docs.length > 0),
      map((docs: CardDocument[]) => docs.map((_: CardDocument) => _.toJSON())),
      defaultIfEmpty(undefined),
    );

  /**
   * Returns one card of the list matching id in parameter
   *
   * @param {string} id of the card in the db
   *
   * @return {Observable<Card | void>}
   */
  findById = (id: string): Observable<Card | void> =>
    from(this._cardModel.findById(id)).pipe(
      filter((doc: CardDocument) => !!doc),
      map((doc: CardDocument) => doc.toJSON()),
      defaultIfEmpty(undefined),
    );

  /**
   * Returns the cards of the list matching level  in parameter
   *
   * @param {string} level of the card in the db
   *
   * @return {Observable<Card[] | void>}
   */
  findByLevel = (level: number): Observable<Card[] | void> =>
    from(this._cardModel.find({ level: level })).pipe(
      filter((docs: CardDocument[]) => !!docs && docs.length > 0),
      map((docs: CardDocument[]) => docs.map((_: CardDocument) => _.toJSON())),
      defaultIfEmpty(undefined),
    );
}
