import {
  ImATeapotException,
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
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/entities/user.entity';
import { CollectionsService } from '../collections/collections.service';
import { CollectionEntity } from '../collections/entities/collection.entity';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class CardsService {
  /**
   * Contructor of a Cardservice
   *
   * @param _cardsDao {CardsDao} instance of a CardDao
   * @param _usersService {UsersService} instance of the service managing users
   * @param _collecionService {CollectionsService} instance of the service managing collections
   */
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

  /**
   * Generate random numbers in array between 1 and 5
   *
   * @param num number of generated number
   *
   * @return Observable<number[]>
   */
  randomNumbers = (num: number): Observable<number[]> => {
    return of(
      Array.from({ length: num }, () => Math.floor(Math.random() * 5) + 1),
    );
  };

  /**
   * Generate random cards with associated level
   *
   * @param level the level of the card
   *
   * @return Observable<CardEntity>
   */
  randomWithLevel = (level: number): Observable<CardEntity> => {
    return this.findByLevel(level).pipe(
      filter((_: CardEntity[]) => !!_),
      map((_: CardEntity[]) => _[Math.trunc(Math.random() * _.length)]),
    );
  };

  /**
   * Generate 10 randomCards
   *
   * @return Observable<CardEntity[]> List of card generated
   */
  generate10RandomCards = (): Observable<CardEntity[]> =>
    this.randomNumbers(10).pipe(
      // We pipe on an array of numbers
      map((_: number[]) => _.map((__: number) => this.randomWithLevel(__))), // randomWithLevel return an Observable of CardEntity
      switchMap((_) => combineLatest(_)), // We assemble the array of observable to make it an Observable of Array
    );

  /**
   * Do a roll of cards for the user
   *
   * @param userId of the user that doing the roll
   *
   * @return Observable<CollectionEntity[]> return a roll
   */
  roll(userId: string): Observable<CollectionEntity[]> {
    return this._usersService.findOne(userId).pipe(
      filter((_: UserEntity) => !!_),
      mergeMap((_: UserEntity) =>
        !!_ &&
        (!_.lastRollDate || // If the date is not present then we do the roll
          (_.lastRollDate &&
            Date.now().valueOf() - _.lastRollDate > 1)) /*86400000*/
          ? of(_)
          : throwError(() => new ImATeapotException()),
      ),
      mergeMap((_: UserEntity) =>
        this._usersService.changeRollDate(_, Date.now()),
      ),
      filter((_: User) => !!_),
      mergeMap((_: User) =>
        this.generate10RandomCards().pipe(
          mergeMap((__) => this.addCardToUser(_._id, __)),
          defaultIfEmpty([] as CollectionEntity[]),
        ),
      ),
    );
  }

  /**
   * Add the list of cards to the user Account (with collections)
   *
   * @param userId of the user
   * @param cards you want to add
   *
   * @return Observable<CollectionEntity[]>
   */
  addCardToUser = (
    userId: string,
    cards: CardEntity[],
  ): Observable<CollectionEntity[]> =>
    of(cards).pipe(
      map((__: CardEntity[]) =>
        __.map((___: CardEntity) =>
          this._collecionService.addCardToUser(userId, ___.id),
        ),
      ),
      switchMap((_) => combineLatest(_)),
    );
}
