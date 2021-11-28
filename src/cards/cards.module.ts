import { Logger, Module } from '@nestjs/common';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { CardsDao } from './dao/cards.dao';
import { MongooseModule } from '@nestjs/mongoose';
import { Card, CardSchema } from './schemas/card.shema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Card.name, schema: CardSchema }]),
  ],
  controllers: [CardsController],
  providers: [CardsService, CardsDao, Logger],
})
export class CardsModule {}
