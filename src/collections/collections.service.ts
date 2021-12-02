import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { catchError, defaultIfEmpty, Observable, of, throwError } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { CollectionsDao } from './dao/collections.dao';
import { CollectionEntity } from './entities/collection.entity';
import { Collection } from './schemas/collection.schema';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Injectable()
export class CollectionsService {
  constructor(private readonly _collectionDao: CollectionsDao) {}

  /**
   * Returns all existing collections in the list
   *
   * @returns {Observable<CollectionEntity[] | void>}
   */
  findAll = (): Observable<CollectionEntity[] | void> =>
    this._collectionDao.find().pipe(
      filter((_: Collection[]) => !!_),
      map((_: Collection[]) =>
        _.map((__: Collection) => new CollectionEntity(__)),
      ),
      defaultIfEmpty(undefined),
    );

  /**
   * Returns one collection of the list matching id in parameter
   *
   * @param {string} id of the collection in the db
   *
   * @return {Observable<Collection | void>}
   */
  findById(id: string): Observable<CollectionEntity | void> {
    return this._collectionDao.findById(id).pipe(
      catchError((e) =>
        throwError(() => new UnprocessableEntityException(e.message)),
      ),
      mergeMap((_: Collection) =>
        !!_
          ? of(new CollectionEntity(_))
          : throwError(
              () =>
                new NotFoundException(`Collection with id '${id}' not found`),
            ),
      ),
    );
  }

  /**
   * Returns array of collection of user matching id in parameter
   *
   * @param {string} id of the user in the db
   *
   * @return {Observable<Collection[] | void>}
   */
  findAllById = (id: string): Observable<CollectionEntity[] | void> =>
    this._collectionDao.findByUserId(id).pipe(
      filter((_: Collection[]) => !!_),
      map((_: Collection[]) =>
        _.map((__: Collection) => new CollectionEntity(__)),
      ),
      defaultIfEmpty(undefined),
    );

  /**
   * Returns one collection of the list matching id in parameter
   *
   * @param {string} id of the collection
   *
   * @returns {Observable<CollectionEntity>}
   */
  findOne = (id: string): Observable<CollectionEntity | void> =>
    this._collectionDao.findById(id).pipe(
      catchError((e) =>
        throwError(() => new UnprocessableEntityException(e.message)),
      ),
      mergeMap((_: Collection) =>
        !!_
          ? of(new CollectionEntity(_))
          : throwError(
              () => new NotFoundException(`User with id '${id}' not found`),
            ),
      ),
    );

  /**
   * Check if collection already exists and add it in collection list
   *
   * @param collection to create
   *
   * @returns {Observable<CollectionEntity>}
   */
  create = (collection: CreateCollectionDto): Observable<CollectionEntity> =>
    this._collectionDao.create(collection).pipe(
      catchError((e) =>
        e.code === 11000
          ? throwError(
              () =>
                new ConflictException(
                  `Id card'${collection.idCard}' and id user '${collection.idUser}' already exists`,
                ),
            )
          : throwError(() => new UnprocessableEntityException(e.message)),
      ),
      map((_: Collection) => new CollectionEntity(_)),
    );

  /**
   * Update a collection in collections list
   *
   * @param {string} id of the collection to update
   * @param collection data to update
   *
   * @returns {Observable<CollectionEntity>}
   */
  update(
    id: string,
    collection: UpdateCollectionDto,
  ): Observable<CollectionEntity> {
    return this._collectionDao.update(id, collection).pipe(
      catchError((e) =>
        e.code === 11000
          ? throwError(
              () =>
                new ConflictException(
                  `Id card'${collection.idCard}' and id user '${collection.idUser}' already exists`,
                ),
            )
          : throwError(() => new UnprocessableEntityException(e.message)),
      ),
      mergeMap((_: Collection) =>
        !!_
          ? of(new CollectionEntity(_))
          : throwError(
              () =>
                new NotFoundException(`Collection with id '${id}' not found`),
            ),
      ),
    );
  }

  /**
   * Delete one collection in users list
   *
   * @param {string} id of the collection to delete
   *
   * @returns {Observable<void>}
   */
  delete = (id: string): Observable<void> =>
    this._collectionDao.findByIdAndRemove(id).pipe(
      catchError((e) =>
        throwError(() => new UnprocessableEntityException(e.message)),
      ),
      mergeMap((_: Collection) =>
        !!_
          ? of(undefined)
          : throwError(
              () =>
                new NotFoundException(`Collection with id '${id}' not found`),
            ),
      ),
    );

  /**
   * Returns array of collection of tradable card for user matching id in parameter
   *
   * @param {string} id of the user in the db
   *
   * @return {Observable<CollectionEntity[] | void>}
   */
  findAllTradableById = (id: string): Observable<CollectionEntity[] | void> =>
    this._collectionDao.findTradableByUserId(id).pipe(
      filter((_: Collection[]) => !!_),
      map((_: Collection[]) =>
        _.map((__: Collection) => new CollectionEntity(__)),
      ),
      defaultIfEmpty(undefined),
    );

  /**
   * Returns a collection matching user and card id in parameter
   *
   * @param {string} idUser of the user in the db
   * @param {string} idCard of the card in the db
   *
   * @return {Observable<CollectionEntity[] | void>}
   */
  findOneByIdUserIdCard = (
    idUser: string,
    idCard: string,
  ): Observable<CollectionEntity[] | void> =>
    this._collectionDao.findByUserIdAndCardIdArray(idUser, idCard).pipe(
      filter((_: Collection[]) => !!_),
      map((_: Collection[]) =>
        _.map((__: Collection) => new CollectionEntity(__)),
      ),
      defaultIfEmpty(undefined),
    );

  /**
   * Increase the amount by 1 of the collection
   *
   * @param collection the collection you want to increase the amount
   *
   * @return Observable<CollectionEntity>
   */
  private increaseAmount = (
    collection: Collection,
  ): Observable<CollectionEntity> =>
    of(collection).pipe(
      mergeMap((_: Collection) =>
        this.copyDtoAndIncreaseAmountAndWaiting(_, 1, 0),
      ),
      mergeMap((_: UpdateCollectionDto) => this.update(collection._id, _)),
    );

  /**
   * Decrease the amount by 1 of the collection
   *
   * @param collection the collection you want to decrease the amount
   *
   * @return Observable<CollectionEntity>
   */
  private decreaseAmount = (
    collection: Collection,
  ): Observable<CollectionEntity> =>
    of(collection).pipe(
      mergeMap(
        (
          _: Collection, // We decrease the amount
        ) => this.copyDtoAndIncreaseAmountAndWaiting(_, -1, 0),
      ),
      mergeMap((_: UpdateCollectionDto) => this.update(collection._id, _)),
    );

  /**
   * Increase the waiting number by 1 of the collection
   *
   * @param collection the collection you want to increase the waiting number by 1
   *
   * @return Observable<CollectionEntity>
   */
  private increaseWaiting(
    collection: Collection,
  ): Observable<CollectionEntity> {
    return of(collection).pipe(
      mergeMap(
        (
          _: Collection, // We increase the waiting
        ) => this.copyDtoAndIncreaseAmountAndWaiting(_, 0, 1),
      ),

      mergeMap((_: UpdateCollectionDto) => this.update(collection._id, _)),
    );
  }

  /**
   * Decrease the waiting number by 1 of the collection
   *
   * @param collection the collection you want to decrease the waiting number by 1
   *
   * @return Observable<CollectionEntity>
   */
  private decreaseWaiting = (
    collection: Collection,
  ): Observable<CollectionEntity> =>
    of(collection).pipe(
      mergeMap(
        (
          _: Collection, // We decrease the waiting
        ) => this.copyDtoAndIncreaseAmountAndWaiting(_, 0, -1),
      ),
      mergeMap((_: UpdateCollectionDto) => this.update(collection._id, _)),
    );

  /**
   * Increase the waiting number by 1 of the collection
   *
   * @param collection the collection you want to increase the waiting number by 1
   * @param amountToIncrease increase of the amount (can be negative)
   * @param waitingToIncrease increase of the waiting (can be negative)
   *
   * @return Observable<UpdateCollectionDto>
   */
  private copyDtoAndIncreaseAmountAndWaiting = (
    collection: Collection,
    amountToIncrease: number,
    waitingToIncrease: number,
  ): Observable<UpdateCollectionDto> =>
    of({
      idUser: collection.idUser,
      idCard: collection.idCard,
      amount: collection.amount + amountToIncrease,
      waiting: collection.waiting + waitingToIncrease,
    });

  /**
   * Create a default Collection DTO from the ids
   *
   * @param idUser of the user
   * @param idCard of the card
   *
   * @return Observable<CreateCollectionDto>
   * @private
   */
  private createDto(
    idUser: string,
    idCard: string,
  ): Observable<CreateCollectionDto> {
    return of({
      idUser: idUser,
      idCard: idCard,
      amount: 1,
      waiting: 0,
    });
  }

  /**
   * Create default Collection DTO with a negative amount from the ids
   *
   * @param idUser of the user
   * @param idCard of the card
   *
   * @return Observable<CreateCollectionDto>
   * @private
   */
  private createNegativeAmountDto(
    idUser: string,
    idCard: string,
  ): Observable<CreateCollectionDto> {
    return of({
      idUser: idUser,
      idCard: idCard,
      amount: -1,
      waiting: 0,
    });
  }

  /**
   * Create default Collection DTO with a negative waiting number from the ids
   *
   * @param idUser of the user
   * @param idCard of the card
   *
   * @return Observable<CreateCollectionDto>
   * @private
   */
  private createNegativeWaitingDto(
    idUser: string,
    idCard: string,
  ): Observable<CreateCollectionDto> {
    return of({
      idUser: idUser,
      idCard: idCard,
      amount: 0,
      waiting: -1,
    });
  }

  /**
   * Create default Collection DTO with a positive amount from the ids
   *
   * @param idUser of the user
   * @param idCard of the card
   *
   * @return Observable<CreateCollectionDto>
   * @private
   */
  private createWaitingDto(
    idUser: string,
    idCard: string,
  ): Observable<CreateCollectionDto> {
    return of({
      idUser: idUser,
      idCard: idCard,
      amount: 0,
      waiting: 1,
    });
  }

  /**
   * Add a collection with the userId and the cardId
   *
   * @param idUser of the user
   * @param idCard of the card
   *
   * @private
   */
  addCardToUser(idUser: string, idCard: string): Observable<CollectionEntity> {
    return this._collectionDao
      .findByUserIdAndCardId(
        String(idUser.toString()),
        String(idCard.toString()),
      )
      .pipe(
        mergeMap((_: Collection) => {
          return !!_
            ? this.increaseAmount(_)
            : this.createDto(
                String(idUser.toString()),
                String(idCard.toString()),
              ).pipe(mergeMap((__: CreateCollectionDto) => this.create(__)));
        }),
      );
  }

  /**
   * Decrease the collection with idUser and idCard or create a collection with a negative amount
   *
   * @param idUser of the user
   * @param idCard of the card
   *
   * @return Observable<CollectionEntity>
   */
  removeCardToUser(
    idUser: string,
    idCard: string,
  ): Observable<CollectionEntity> {
    return this._collectionDao
      .findByUserIdAndCardId(idUser, idCard)
      .pipe(
        mergeMap((_: Collection) =>
          !!_
            ? this.decreaseAmount(_)
            : this.createNegativeAmountDto(idUser, idCard).pipe(
                mergeMap((__: CreateCollectionDto) => this.create(__)),
              ),
        ),
      );
  }

  /**
   * Increase the waiting number of the associated collection with idUser and isCard
   *
   * @param idUser of the user
   * @param idCard of the card
   *
   * @return Observable<CollectionEntity>
   */
  addCardWaitingToUser(
    idUser: string,
    idCard: string,
  ): Observable<CollectionEntity> {
    return this._collectionDao
      .findByUserIdAndCardId(idUser, idCard)
      .pipe(
        mergeMap((_: Collection) =>
          !!_
            ? this.increaseWaiting(_)
            : this.createWaitingDto(idUser, idCard).pipe(
                mergeMap((__: CreateCollectionDto) => this.create(__)),
              ),
        ),
      );
  }

  /**
   * Decrease the waiting number of the associated collection with idUser and isCard
   *
   * @param idUser of the user
   * @param idCard of the card
   *
   * @return Observable<CollectionEntity>
   */
  removeCardWaitingToUser(
    idUser: string,
    idCard: string,
  ): Observable<CollectionEntity> {
    return this._collectionDao
      .findByUserIdAndCardId(idUser, idCard)

      .pipe(
        mergeMap((_: Collection) =>
          !!_
            ? this.decreaseWaiting(_)
            : this.createNegativeWaitingDto(idUser, idCard).pipe(
                mergeMap((__: CreateCollectionDto) => this.create(__)),
              ),
        ),
      );
  }
}
