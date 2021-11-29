import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { defaultIfEmpty, from, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Collection, CollectionDocument } from '../schemas/collection.shema';

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
   * Call mongoose method, call toJSON on each result and returns UserModel[] or undefined
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
}
