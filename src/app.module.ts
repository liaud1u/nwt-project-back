import { Logger, Module } from '@nestjs/common';
import { TestModule } from './test/test.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CardsModule } from './cards/cards.module';
import * as Config from 'config';

@Module({
  imports: [
    TestModule,
    AuthModule,
    UsersModule,
    MongooseModule.forRoot(Config.get<string>('mongodb.uri')),
    CardsModule,
  ],
  providers: [Logger],
  controllers: [AppController],
})
export class AppModule {}
