import { Logger, Module } from '@nestjs/common';
import { CollectionsController } from './collections.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Collection, CollectionSchema } from './schemas/collection.schema';
import { CollectionsService } from './collections.service';
import { CollectionsDao } from './dao/collections.dao';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Collection.name, schema: CollectionSchema },
    ]),
  ],
  controllers: [CollectionsController],
  providers: [CollectionsService, CollectionsDao, Logger],
  exports: [CollectionsService],
})
export class CollectionsModule {}
