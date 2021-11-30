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
import { filter, map, mergeMap, tap } from 'rxjs/operators';
import { CardEntity } from './entities/card.entity';
import { Card } from './schemas/card.shema';
import { CardsDao } from './dao/cards.dao';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/entities/user.entity';
import { CollectionsService } from '../collections/collections.service';
import { CollectionEntity } from '../collections/entities/collection.entity';

@Injectable()
export class CardsService {
  constructor(
    private readonly _cardsDao: CardsDao,
    private readonly _usersService: UsersService,
    private readonly _collecionService: CollectionsService,
  ) {}

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
    return of(
      Array.from({ length: num }, () => Math.floor(Math.random() * 5) + 1),
    );
  };

  randomWithLevel = (level: number): Observable<CardEntity> => {
    return this.findByLevel(level).pipe(
      filter((_: CardEntity[]) => !!_),
      map((_: CardEntity[]) => {
        return _[Math.trunc(Math.random() * _.length)];
      }),
    );
  };

  generate10RandomCards = (): Observable<CardEntity[]> =>
    this.randomNumbers(10).pipe(
      map((_: number[]) => _.map((__: number) => this.randomWithLevel(__))),
      switchMap((_) => combineLatest(_)),
    );

  roll(id: string): Observable<CollectionEntity[]> {
    return this._usersService.findOne(id).pipe(
      filter((_: UserEntity) => !!_),
      mergeMap((_: UserEntity) =>
        this.generate10RandomCards().pipe(
          mergeMap((__) => this.addCardToUser(_.id, __)), // ERREUR ICI POURQUOI ? JE NE SAIS PAS
          defaultIfEmpty([] as CollectionEntity[]),
          tap((_) => console.log(_)),
        ),
      ),
    );
  }

  addCardToUser = (
    userId: string,
    cards: CardEntity[],
  ): Observable<CollectionEntity[]> =>
    of(cards).pipe(
      tap((_) => console.log('start addCart to User')),
      map((__: CardEntity[]) => {
        console.log(__);
        console.log(__.length);
        return __.map((___: CardEntity) =>
          this._collecionService.addCardToUser(userId, ___.id),
        );
      }),
      switchMap((_) => combineLatest(_)),
    );
}
