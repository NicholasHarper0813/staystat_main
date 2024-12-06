import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export enum UserRole {
  ADMIN = 'ADMIN',
  SUBADMIN = 'SUBADMIN',
  USER = 'USER',
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  _id: mongoose.Schema.Types.ObjectId;

  @Prop()
  name: string;

  @Prop()
  serialNumber: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  profilePic: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  email: string;

  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.SUBADMIN,
    required: true,
  })
  role: UserRole;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  loginTime: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  addedBy: mongoose.Schema.Types.ObjectId;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' }] })
  hotel: mongoose.Schema.Types.ObjectId[];

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
