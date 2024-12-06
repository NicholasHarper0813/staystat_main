import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
class OwnerContact {
  @Prop({ required: true })
  phone: string;

  @Prop()
  email: string;
}

@Schema({ timestamps: true })
export class Hotel extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  _id: mongoose.Schema.Types.ObjectId;

  @Prop()
  serialNumber: string;

  @Prop({ required: true })
  hotelName: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  ownerName: string;

  @Prop({ type: OwnerContact })
  ownerContact: OwnerContact;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ required: true })
  GSTNumber: string;

  @Prop({ required: true })
  panNumber: string;

  @Prop({ required: true })
  aadharNumber: string;

  @Prop()
  tradeLicense: string;

  @Prop([String])
  roomCategories: string[];

  @Prop({ required: true })
  bank: string;

  @Prop({ required: true })
  accountNumber: string;

  @Prop({ required: true })
  ifscCode: string;

  @Prop()
  otherDocuments: string;

  @Prop()
  documentId: string;

  @Prop({ required: true })
  frontOfficeContact: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  addedBy: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;
}

export const HotelSchema = SchemaFactory.createForClass(Hotel);
