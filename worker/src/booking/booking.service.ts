import { Injectable } from '@nestjs/common';

import { CreateBookingDto } from './dto/booking.dto';
import { BookingRepository } from './repository/booking.repository';
import { Booking } from './model/booking.model';

@Injectable()
export class BookingService {
  constructor(private readonly bookingRepository: BookingRepository) {}

  async createBookings(bookings: CreateBookingDto[]): Promise<Booking[]> {
    await this.bookingRepository.deleteAll();
    const createdBookings = [];
    for (const booking of bookings) {
      createdBookings.push(await this.bookingRepository.create(booking));
    }
    return createdBookings;
  }
  async findAll(): Promise<Booking[]> {
    return this.bookingRepository.findAll();
  }
}
