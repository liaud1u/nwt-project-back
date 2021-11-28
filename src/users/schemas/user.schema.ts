import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & Document;

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
export class User {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  })
  _id: any;

  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  username: string;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  photo: string;

  @Prop({
    type: String,
    required: true,
    minlength: 2,
    trim: true,
  })
  firstname: string;

  @Prop({
    type: String,
    required: true,
    minlength: 2,
    trim: true,
  })
  lastname: string;

  @Prop({
    type: Date,
    required: true,
  })
  birthDate: number;

  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
