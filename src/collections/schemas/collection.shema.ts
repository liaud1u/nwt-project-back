import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CollectionDocument = Collection & Document;

@Schema({
  toJSON: {
    virtuals: true,
    transform: (doc: any, ret: any) => {
      // delete obsolete data
      delete ret._id;
    },
  },
  versionKey: false,
})
export class Collection {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  })
  _id: any;

  @Prop({
    type: Number,
    required: true,
    trim: true,
  })
  amount: number;

  @Prop({
    type: Number,
    required: true,
    trim: true,
  })
  waiting: number;

  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  idCard: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  idUser: string;
}

export const CollectionSchema = SchemaFactory.createForClass(Collection);
