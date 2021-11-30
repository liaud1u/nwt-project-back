import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TradeDocument = Trade & Document;

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
export class Trade {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  })
  _id: any;

  @Prop({
    type: String,
    auto: true,
  })
  creationTime: string;

  @Prop({
    type: Boolean,
    required: true,
  })
  accepted: boolean;

  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  idUser: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  idUserWaiting: string;

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
  idCardWanted: string;
}

export const TradeSchema = SchemaFactory.createForClass(Trade);
