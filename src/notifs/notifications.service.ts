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
import { UserEntity } from '../users/entities/user.entity';
import { User } from '../users/schemas/user.schema';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
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
   * Returns one notifications of the list matching id in parameter
   *
   * @param {string} id of the collection in the db
   *
   * @return {Observable<Notification | void>}
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
                new NotFoundException(
                  `notifications with id '${id}' not found`,
                ),
            ),
      ),
    );

  /**
   * Returns array of notifications of user matching id in parameter
   *
   * @param {string} id of the user in the db
   *
   * @return {Observable<Notification[] | void>}
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
   * Returns one notifications of the list matching id in parameter
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
   * Check if notifications already exists and add it in notifications list
   *
   * @param notifications to create
   *
   * @returns {Observable<NotificationEntity>}
   */
  create = (
    notificationDto: CreateNotificationDto,
  ): Observable<NotificationEntity> =>
    this._notificationDao.create(notificationDto).pipe(
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
   * Update a notification in notifications list
   *
   * @param {string} id of the notification to update
   * @param notification data to update
   *
   * @returns {Observable<NotificationEntity>}
   */
  patch(
    id: string,
    notificationDto: PatchNotificationDto,
  ): Observable<NotificationEntity> {
    return this._notificationDao.patch(id, notificationDto).pipe(
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
   * Deletes one collection in users list
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
