import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type NotificationDocument = Notification & Document;

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
export class Notification {
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
  read: boolean;

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
  type: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  content: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
