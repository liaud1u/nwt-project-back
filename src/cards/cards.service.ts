import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  catchError,
  combineLatest,
  defaultIfEmpty,
  Observable,
  of,
  switchMap,
  throwError,
} from 'rxjs';
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
      map((_: Card[]) =>
        !!_ && _.length > 0
          ? _.map((__: Card) => new CardEntity(__))
          : throwError(
              () =>
                new NotFoundException(`Cards with level '${level}' not found`),
            ),
      ),
      defaultIfEmpty(undefined),
    );

  randomNumbers = (num: number): Observable<number[]> => {
    return of(Array.from({ length: num }, () => Math.floor(Math.random() * 6)));
  };

  randomWithLevel = (level: number): Observable<CardEntity> => {
    return this.findByLevel(level).pipe(
      filter((_: CardEntity[]) => !!_),
      map((_: CardEntity[]) => {
        return _[Math.trunc(Math.random() * _.length)];
      }),
    );
  };

  roll(id: string): Observable<CardEntity[]> {
    const randomNumbers = Array.from(
      { length: 10 },
      () => Math.floor(Math.random() * 5) + 1,
    );

    const cards = [] as Observable<CardEntity>[];

    randomNumbers.forEach((value) => {
      cards.push(this.randomWithLevel(value));
    });
    return of(cards).pipe(switchMap((_) => combineLatest(_)));
  }
}
