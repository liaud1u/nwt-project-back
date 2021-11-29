import {
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
}
