import { Logger, Module } from '@nestjs/common';
import { TestModule } from './test/test.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CardsModule } from './cards/cards.module';
import { CollectionsModule } from './collections/collections.module';
import * as Config from 'config';
import { NotificationsModule } from './notifs/notifications.module';
import { TradesModule } from './trades/trades.module';

@Module({
  imports: [
    TestModule,
    AuthModule,
    UsersModule,
    MongooseModule.forRoot(Config.get<string>('mongodb.uri')),
    CardsModule,
    CollectionsModule,
    NotificationsModule,
    TradesModule,
  ],
  providers: [Logger],
  controllers: [AppController],
})
export class AppModule {}
