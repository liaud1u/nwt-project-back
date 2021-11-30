import { Logger, Module } from '@nestjs/common';
import { TradesController } from './trades.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TradesService } from './trades.service';
import { TradesDao } from './dao/trades.dao';
import { Trade, TradeSchema } from './schemas/trade.shema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Trade.name, schema: TradeSchema }]),
  ],
  controllers: [TradesController],
  providers: [TradesService, TradesDao, Logger],
})
export class TradesModule {}
