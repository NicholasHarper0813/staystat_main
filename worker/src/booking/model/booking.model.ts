import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Booking extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true })
  hotel: mongoose.Schema.Types.ObjectId;

  @Prop()
  serialNumber: string;

  @Prop({ required: true })
  guestName: string;

  @Prop()
  guestEmail: string;

  @Prop({ required: true })
  checkInDate: Date;

  @Prop({ required: true })
  checkOutDate: Date;

  @Prop({ required: true })
  roomCategory: string;

  @Prop({ required: true })
  numberOfRooms: string;

  @Prop({ required: true })
  numberOfPersons: string;

  @Prop({ required: true })
  bookingAmount: number;

  @Prop({ required: true })
  advanceAmount: number;

  @Prop({ required: true })
  dueAmount: number;

  @Prop({ required: true })
  advanceDate: Date;

  @Prop({ required: true })
  bookingSource: string;

  @Prop({ required: true })
  bookingBy: string;

  @Prop({ required: true })
  plan: string;

  @Prop({ required: true })
  contactNumber: string;

  @Prop()
  remarks: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  addedBy: mongoose.Schema.Types.ObjectId;

  @Prop({ enum: ['CONFIRMED', 'CANCELLED'], default: 'CONFIRMED' })
  status: string;

  @Prop()
  accountType: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
