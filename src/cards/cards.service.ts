import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { catchError, defaultIfEmpty, Observable, of, throwError } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { CardEntity } from './entities/card.entity';
import { Card } from './schemas/card.shema';
import { CardsDao } from './dao/cards.dao';

@Injectable()
export class CardsService {
  constructor(private readonly _cardsDao: CardsDao) {}

  /**
   * Returns all existing cards in the list
   *
   * @returns {Observable<CardEntity[] | void>}
   */
  findAll = (): Observable<CardEntity[] | void> =>
    this._cardsDao.find().pipe(
      filter((_: Card[]) => !!_),
      map((_: Card[]) => _.map((__: Card) => new CardEntity(__))),
      defaultIfEmpty(undefined),
    );

  /**
   * Returns one card of the list matching id in parameter
   *
   * @param {string} id of the card in the db
   *
   * @return {Observable<Card | void>}
   */
  findById = (id: string): Observable<CardEntity | void> =>
    this._cardsDao.findById(id).pipe(
      catchError((e) =>
        throwError(() => new UnprocessableEntityException(e.message)),
      ),
      mergeMap((_: Card) =>
        !!_
          ? of(new CardEntity(_))
          : throwError(
              () => new NotFoundException(`Card with id '${id}' not found`),
            ),
      ),
    );

  /**
   * Returns cards of the list matching level in parameter
   *
   * @param {string} level of the card in the db
   *
   * @return {Observable<Card | void>}
   */
  findByLevel = (level: number): Observable<CardEntity[] | void> =>
    this._cardsDao.findByLevel(level).pipe(
      catchError((e) =>
        throwError(() => new UnprocessableEntityException(e.message)),
      ),
      filter((_: Card[]) => !!_),
      mergeMap((_: Card[]) =>
        !!_ && _.length > 0
          ? _.map((__: Card) => new CardEntity(__))
          : throwError(
              () =>
                new NotFoundException(`Cards with level '${level}' not found`),
            ),
      ),
      defaultIfEmpty(undefined),
    );
}
