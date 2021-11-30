import { Logger, Module } from '@nestjs/common';
import { CollectionsController } from './collections.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Collection, CollectionSchema } from './schemas/collection.shema';
import { CollectionsService } from './collections.service';
import { CollectionsDao } from './dao/collections.dao';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Collection.name, schema: CollectionSchema },
    ]),
  ],
  controllers: [CollectionsController],
  exports: [CollectionsService],
  providers: [CollectionsService, CollectionsDao, Logger],
})
export class CollectionsModule {}
