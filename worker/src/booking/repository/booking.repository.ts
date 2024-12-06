import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking } from '../model/booking.model';
import { CreateBookingDto } from '../dto/booking.dto';

@Injectable()
export class BookingRepository {
  constructor(
    @InjectModel(Booking.name) private readonly bookingModel: Model<Booking>,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const createdBooking = new this.bookingModel(createBookingDto);
    return createdBooking.save();
  }

  async deleteAll(): Promise<void> {
    await this.bookingModel.deleteMany({}).exec();
  }
  async findAll(): Promise<Booking[]> {
    return this.bookingModel.find().exec();
  }
}
