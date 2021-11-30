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
import { Collection } from './schemas/collection.shema';
import { UserEntity } from '../users/entities/user.entity';
import { User } from '../users/schemas/user.schema';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
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
  findById = (id: string): Observable<CollectionEntity | void> =>
    this._collectionDao.findById(id).pipe(
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
  create = (collectionDto: CreateCollectionDto): Observable<CollectionEntity> =>
    this._collectionDao.create(collectionDto).pipe(
      catchError((e) =>
        e.code === 11000
          ? throwError(
              () =>
                new ConflictException(
                  `Id card'${collectionDto.idCard}' and id user '${collectionDto.idUser}' already exists`,
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
    collectionDto: UpdateCollectionDto,
  ): Observable<CollectionEntity> {
    return this._collectionDao.update(id, collectionDto).pipe(
      catchError((e) =>
        e.code === 11000
          ? throwError(
              () =>
                new ConflictException(
                  `Id card'${collectionDto.idCard}' and id user '${collectionDto.idUser}' already exists`,
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
   * Deletes one collection in users list
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
   * @return {Observable<Collection[] | void>}
   */
  findAllTradableById = (id: string): Observable<CollectionEntity[] | void> =>
    this._collectionDao.findTradableByUserId(id).pipe(
      filter((_: Collection[]) => !!_),
      map((_: Collection[]) =>
        _.map((__: Collection) => new CollectionEntity(__)),
      ),
      defaultIfEmpty(undefined),
    );
}
