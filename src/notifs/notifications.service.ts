import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { catchError, defaultIfEmpty, Observable, of, throwError } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { NotificationsDao } from './dao/notifications.dao';
import { NotificationEntity } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { PatchNotificationDto } from './dto/patch-notification.dto';
import { Notification } from './schemas/notification.shema';

@Injectable()
export class NotificationsService {
  constructor(private readonly _notificationDao: NotificationsDao) {}

  /**
   * Returns all existing notifications in the list
   *
   * @returns {Observable<NotificationEntity[] | void>}
   */
  findAll = (): Observable<NotificationEntity[] | void> =>
    this._notificationDao.find().pipe(
      filter((_: Notification[]) => !!_),
      map((_: Notification[]) =>
        _.map((__: Notification) => new NotificationEntity(__)),
      ),
      defaultIfEmpty(undefined),
    );

  /**
   * Returns one notification of the list matching id in parameter
   *
   * @param {string} id of the notification in the db
   *
   * @return {Observable<NotificationEntity | void>}
   */
  findById = (id: string): Observable<NotificationEntity | void> =>
    this._notificationDao.findById(id).pipe(
      catchError((e) =>
        throwError(() => new UnprocessableEntityException(e.message)),
      ),
      mergeMap((_: Notification) =>
        !!_
          ? of(new NotificationEntity(_))
          : throwError(
              () =>
                new NotFoundException(`Notification with id '${id}' not found`),
            ),
      ),
    );

  /**
   * Returns array of notifications of the user matching id in parameter
   *
   * @param {string} id of the user in the db
   *
   * @return {Observable<NotificationEntity[] | void>}
   */
  findAllById = (id: string): Observable<NotificationEntity[] | void> =>
    this._notificationDao.findByUserId(id).pipe(
      filter((_: Notification[]) => !!_),
      map((_: Notification[]) =>
        _.map((__: Notification) => new NotificationEntity(__)),
      ),
      defaultIfEmpty(undefined),
    );

  /**
   * Returns one notification matching id in parameter
   *
   * @param {string} id of the notifications
   *
   * @returns {Observable<NotificationEntity>}
   */
  findOne = (id: string): Observable<NotificationEntity | void> =>
    this._notificationDao.findById(id).pipe(
      catchError((e) =>
        throwError(() => new UnprocessableEntityException(e.message)),
      ),
      mergeMap((_: Notification) =>
        !!_
          ? of(new NotificationEntity(_))
          : throwError(
              () =>
                new NotFoundException(
                  `notifications with id '${id}' not found`,
                ),
            ),
      ),
    );

  /**
   * Check if notification already exists and add it in notifications list
   *
   * @param notification to create
   *
   * @returns {Observable<NotificationEntity>}
   */
  create = (
    notification: CreateNotificationDto,
  ): Observable<NotificationEntity> =>
    this._notificationDao.create(notification).pipe(
      catchError((e) =>
        e.code === 11000
          ? throwError(
              () => new ConflictException(`Id notification already exists`),
            )
          : throwError(() => new UnprocessableEntityException(e.message)),
      ),
      map((_: Notification) => new NotificationEntity(_)),
    );

  /**
   * Update a notification with the matching id in the list of notifications
   *
   * @param {string} id of the notification to update
   * @param notification data to update
   *
   * @returns {Observable<NotificationEntity>}
   */
  patch(
    id: string,
    notification: PatchNotificationDto,
  ): Observable<NotificationEntity> {
    return this._notificationDao.patch(id, notification).pipe(
      catchError((e) =>
        e.code === 11000
          ? throwError(
              () => new ConflictException(`Id notification already exists`),
            )
          : throwError(() => new UnprocessableEntityException(e.message)),
      ),
      mergeMap((_: Notification) =>
        !!_
          ? of(new NotificationEntity(_))
          : throwError(
              () =>
                new NotFoundException(`Notification with id '${id}' not found`),
            ),
      ),
    );
  }

  /**
   * Delete one notification in the list of notifications
   *
   * @param {string} id of the collection to delete
   *
   * @returns {Observable<void>}
   */
  delete = (id: string): Observable<void> =>
    this._notificationDao.findByIdAndRemove(id).pipe(
      catchError((e) =>
        throwError(() => new UnprocessableEntityException(e.message)),
      ),
      mergeMap((_: Notification) =>
        !!_
          ? of(undefined)
          : throwError(
              () =>
                new NotFoundException(`Collection with id '${id}' not found`),
            ),
      ),
    );
}
