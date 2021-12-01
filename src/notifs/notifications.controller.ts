import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { NotificationEntity } from './entities/notification.entity';
import { NotificationsService } from './notifications.service';
import { HttpInterceptor } from '../interceptors/http.interceptor';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PatchNotificationDto } from './dto/patch-notification.dto';
import { HandlerParams } from './validators/handler-params';

@ApiTags('notifications')
@Controller('notifications')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(HttpInterceptor)
export class NotificationsController {
  /**
   * Class constructor
   * @param _notificationModel
   */
  constructor(private readonly _notificationModel: NotificationsService) {}

  /**
   * Handler to answer to GET /notifications route
   *
   * @returns Observable<TradeEntity[] | void>
   */
  @ApiOkResponse({
    description: 'Returns an array of notifications',
    type: NotificationEntity,
    isArray: true,
  })
  @ApiNoContentResponse({ description: 'No notification exists in database' })
  @Get()
  findAll(): Observable<NotificationEntity[] | void> {
    return this._notificationModel.findAll();
  }

  /**
   * Handler to answer to GET /notification/user/:id route
   *
   * @returns Observable<TradeEntity[] | void>
   */
  @ApiOkResponse({
    description: 'Returns the array of notification for the given "id"',
    type: NotificationEntity,
  })
  @ApiNotFoundResponse({
    description: 'No Notifications for the specified user ID',
  })
  @ApiBadRequestResponse({ description: 'Parameter provided is not good' })
  @ApiUnprocessableEntityResponse({
    description: "The request can't be performed in the database",
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the user in the database',
    type: String,
    allowEmptyValue: false,
  })
  @Get('/users/:id')
  findAllById(
    @Param() params: HandlerParams,
  ): Observable<NotificationEntity[] | void> {
    return this._notificationModel.findAllById(params.id);
  }

  /**
   * Handler to answer to GET /notification/:id route
   *
   * @param {HandlerParams} params list of route params to take notification id
   *
   * @returns Observable<NotificationEntity>
   */
  @ApiOkResponse({
    description: 'Returns the notification for the given "id"',
    type: NotificationEntity,
  })
  @ApiNotFoundResponse({
    description:
      'Notification with the given "id" doesn\'t exist in the database',
  })
  @ApiBadRequestResponse({ description: 'Parameter provided is not good' })
  @ApiUnprocessableEntityResponse({
    description: "The request can't be performed in the database",
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the collection in the database',
    type: String,
    allowEmptyValue: false,
  })
  @Get(':id')
  findOne(
    @Param() params: HandlerParams,
  ): Observable<NotificationEntity | void> {
    return this._notificationModel.findOne(params.id);
  }

  /**
   * Handler to answer to POST /notifications route
   *
   * @param createNotificationDto data to create
   *
   * @returns Observable<NotificationEntity>
   */
  @ApiCreatedResponse({
    description: 'The notification has been successfully created',
    type: NotificationEntity,
  })
  @ApiConflictResponse({
    description: 'The notification already exists in the database',
  })
  @ApiBadRequestResponse({ description: 'Payload provided is not good' })
  @ApiUnprocessableEntityResponse({
    description: "The request can't be performed in the database",
  })
  @ApiUnauthorizedResponse({
    description:
      'An access token of the user is required to perform this action',
  })
  @ApiBody({
    description: 'Payload to create a new collection',
    type: CreateNotificationDto,
  })
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(
    @Body() createNotificationDto: CreateNotificationDto,
  ): Observable<NotificationEntity> {
    return this._notificationModel.create(createNotificationDto);
  }

  /**
   * Handler to answer to PUT /notifications/:id route
   *
   * @param {HandlerParams} params list of route params to take notification id
   * @param updateNotificationDto data to update
   *
   * @returns Observable<NotificationEntity>
   */
  @ApiOkResponse({
    description: 'The notification has been successfully updated',
    type: NotificationEntity,
  })
  @ApiNotFoundResponse({
    description:
      'Notification with the given "id" doesn\'t exist in the database',
  })
  @ApiConflictResponse({
    description: 'The collections already exists in the database',
  })
  @ApiBadRequestResponse({
    description: 'Parameter and/or payload provided are not good',
  })
  @ApiUnprocessableEntityResponse({
    description: "The request can't be performed in the database",
  })
  @ApiUnauthorizedResponse({
    description:
      'An access token of the user is required to perform this action',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the notification in the database',
    type: String,
    allowEmptyValue: false,
  })
  @ApiBody({
    description: 'Payload to update a notification',
    type: PatchNotificationDto,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  patch(
    @Param() params: HandlerParams,
    @Body() updateNotificationDto: PatchNotificationDto,
  ): Observable<NotificationEntity> {
    return this._notificationModel.patch(params.id, updateNotificationDto);
  }

  /**
   * Handler to answer to DELETE /notification/:id route
   *
   * @param {HandlerParams} params list of route params to take notification id
   *
   * @returns Observable<void>
   */
  @ApiNoContentResponse({
    description: 'The notification has been successfully deleted',
  })
  @ApiNotFoundResponse({
    description:
      'Notification with the given "id" doesn\'t exist in the database',
  })
  @ApiBadRequestResponse({ description: 'Parameter provided is not good' })
  @ApiUnprocessableEntityResponse({
    description: "The request can't be performed in the database",
  })
  @ApiUnauthorizedResponse({
    description:
      'An access token of the user is required to perform this action',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the notification in the database',
    type: String,
    allowEmptyValue: false,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  delete(@Param() params: HandlerParams): Observable<void> {
    return this._notificationModel.delete(params.id);
  }
}
