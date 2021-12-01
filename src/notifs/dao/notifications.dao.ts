import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { defaultIfEmpty, from, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { PatchNotificationDto } from '../dto/patch-notification.dto';
import {
  Notification,
  NotificationDocument,
} from '../schemas/notification.shema';

@Injectable()
export class NotificationsDao {
  /**
   * Class constructor
   *
   * @param {Model<NotificationDocument>} _notificationModel instance of the model representing a Notification
   */
  constructor(
    @InjectModel(Notification.name)
    private readonly _notificationModel: Model<NotificationDocument>,
  ) {}

  /**
   * Call mongoose method, call toJSON on each result and returns NotificationModel[] or undefined
   *
   * @return {Observable<Notification[] | void>}
   */
  find = (): Observable<Notification[] | void> =>
    from(this._notificationModel.find({})).pipe(
      filter((docs: NotificationDocument[]) => !!docs && docs.length > 0),
      map((docs: NotificationDocument[]) =>
        docs.map((_: NotificationDocument) => _.toJSON()),
      ),
      defaultIfEmpty(undefined),
    );

  /**
   * Returns one notification of the list matching id in parameter
   *
   * @param {string} id of the notification in the db
   *
   * @return {Observable<Notification | void>}
   */
  findById = (id: string): Observable<Notification | void> =>
    from(this._notificationModel.findById(id)).pipe(
      filter((doc: NotificationDocument) => !!doc),
      map((doc: NotificationDocument) => doc.toJSON()),
      defaultIfEmpty(undefined),
    );

  /**
   * Call mongoose method, call toJSON on each result and returns Notification[] or undefined
   *
   * @return {Observable<Notification[] | void>}
   */
  findByUserId = (id: string): Observable<Notification[] | void> =>
    from(this._notificationModel.find({ idUser: id })).pipe(
      filter((docs: NotificationDocument[]) => !!docs && docs.length > 0),
      map((docs: NotificationDocument[]) =>
        docs.map((_: NotificationDocument) => _.toJSON()),
      ),
      defaultIfEmpty(undefined),
    );

  /**
   * Check if notification already exists with index and add it in notification list
   *
   * @param {CreateNotificationDto} notification to create
   *
   * @return {Observable<Notification>}
   */
  create = (notification: CreateNotificationDto): Observable<Notification> =>
    from(new this._notificationModel(notification).save()).pipe(
      map((doc: NotificationDocument) => doc.toJSON()),
    );

  /**
   *
   * Update a notification in notification list
   *
   * @param {string} id
   * @param {PatchNotificationDto} notification
   *
   * @return {Observable<Notification | void>}
   */
  patch = (
    id: string,
    notification: PatchNotificationDto,
  ): Observable<Notification | void> =>
    from(
      this._notificationModel.findByIdAndUpdate(id, notification, {
        new: true,
        runValidators: true,
      }),
    ).pipe(
      filter((doc: NotificationDocument) => !!doc),
      map((doc: NotificationDocument) => doc.toJSON()),
      defaultIfEmpty(undefined),
    );

  /**
   * Delete a notification in notification list
   *
   * @param {string} id
   *
   * @return {Observable<Notification | void>}
   */
  findByIdAndRemove = (id: string): Observable<Notification | void> =>
    from(this._notificationModel.findByIdAndRemove(id)).pipe(
      filter((doc: NotificationDocument) => !!doc),
      map((doc: NotificationDocument) => doc.toJSON()),
      defaultIfEmpty(undefined),
    );
}
