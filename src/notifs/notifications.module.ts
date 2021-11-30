import { Logger, Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsService } from './notifications.service';
import { NotificationsDao } from './dao/notifications.dao';
import { Notification, NotificationSchema } from './schemas/notification.shema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsDao, Logger],
})
export class NotificationsModule {}
