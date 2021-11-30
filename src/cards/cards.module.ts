import { Logger, Module } from '@nestjs/common';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { CardsDao } from './dao/cards.dao';
import { MongooseModule } from '@nestjs/mongoose';
import { Card, CardSchema } from './schemas/card.shema';
import { UsersModule } from '../users/users.module';
import { CollectionsModule } from '../collections/collections.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Card.name, schema: CardSchema }]),
    UsersModule,
    CollectionsModule,
  ],
  controllers: [CardsController],
  providers: [CardsService, CardsDao, Logger],
})
export class CardsModule {}
