import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { defaultIfEmpty, from, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Collection, CollectionDocument } from '../schemas/collection.shema';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { User, UserDocument } from '../../users/schemas/user.schema';
import { CreateCollectionDto } from '../dto/create-collection.dto';
import { UpdateUserDto } from '../../users/dto/update-user.dto';
import { UpdateCollectionDto } from '../dto/update-collection.dto';

@Injectable()
export class CollectionsDao {
  /**
   * Class constructor
   *
   * @param {Model<CollectionDocument>} _collectionModel instance of the model representing a Collection
   */
  constructor(
    @InjectModel(Collection.name)
    private readonly _collectionModel: Model<CollectionDocument>,
  ) {}

  /**
   * Call mongoose method, call toJSON on each result and returns CollectionModel[] or undefined
   *
   * @return {Observable<Collection[] | void>}
   */
  find = (): Observable<Collection[] | void> =>
    from(this._collectionModel.find({})).pipe(
      filter((docs: CollectionDocument[]) => !!docs && docs.length > 0),
      map((docs: CollectionDocument[]) =>
        docs.map((_: CollectionDocument) => _.toJSON()),
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
  findById = (id: string): Observable<Collection | void> =>
    from(this._collectionModel.findById(id)).pipe(
      filter((doc: CollectionDocument) => !!doc),
      map((doc: CollectionDocument) => doc.toJSON()),
      defaultIfEmpty(undefined),
    );

  /**
   * Call mongoose method, call toJSON on each result and returns CollectionModel[] or undefined
   *
   * @return {Observable<Collection[] | void>}
   */
  findByUserId = (id: string): Observable<Collection[] | void> =>
    from(this._collectionModel.find()).pipe(
      filter((docs: CollectionDocument[]) => !!docs && docs.length > 0),
      map((docs: CollectionDocument[]) =>
        docs.map((_: CollectionDocument) => _.toJSON()),
      ),
      defaultIfEmpty(undefined),
    );

  /**
   * Call mongoose method, call toJSON on each result and returns CollectionModel[] or undefined
   *
   * @return {Observable<Collection[] | void>}
   */
  findTradableByUserId = (id: string): Observable<Collection[] | void> =>
    from(
      this._collectionModel.find({
        $and: [{ $expr: { $gt: ['$amount', '$waiting'] } }, { idUser: id }],
      }),
    ).pipe(
      filter((docs: CollectionDocument[]) => !!docs && docs.length > 0),
      map((docs: CollectionDocument[]) =>
        docs.map((_: CollectionDocument) => _.toJSON()),
      ),
      defaultIfEmpty(undefined),
    );

  /**
   * Check if collection already exists with index and add it in collection list
   *
   * @param {CreateCollectionDto} collection to create
   *
   * @return {Observable<Collection>}
   */
  create = (collectionDto: CreateCollectionDto): Observable<Collection> =>
    from(new this._collectionModel(collectionDto).save()).pipe(
      map((doc: CollectionDocument) => doc.toJSON()),
    );

  /**
   * Update a collection in collections list
   *
   * @param {string} id
   * @param {UpdateCollectionDto} collection
   *
   * @return {Observable<Collection | void>}
   */
  update = (
    id: string,
    collectionDto: UpdateCollectionDto,
  ): Observable<Collection | void> =>
    from(
      this._collectionModel.findByIdAndUpdate(id, collectionDto, {
        new: true,
        runValidators: true,
      }),
    ).pipe(
      filter((doc: CollectionDocument) => !!doc),
      map((doc: CollectionDocument) => doc.toJSON()),
      defaultIfEmpty(undefined),
    );

  /**
   * Delete a user in collection list
   *
   * @param {string} id
   *
   * @return {Observable<Collection | void>}
   */
  findByIdAndRemove = (id: string): Observable<Collection | void> =>
    from(this._collectionModel.findByIdAndRemove(id)).pipe(
      filter((doc: CollectionDocument) => !!doc),
      map((doc: CollectionDocument) => doc.toJSON()),
      defaultIfEmpty(undefined),
    );
}
