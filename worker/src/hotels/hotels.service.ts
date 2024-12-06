import { Injectable } from '@nestjs/common';

import { CreateHotelDto } from './dto/hotel.dto';
import { HotelRepository } from './repository/hotel.repository';
import { Hotel } from './model/hotel.model';

@Injectable()
export class HotelService {
  constructor(private readonly hotelRepository: HotelRepository) {}

  async createHotels(hotels: CreateHotelDto[]): Promise<Hotel[]> {
    await this.hotelRepository.deleteAll();
    const createdHotels = [];
    for (const hotel of hotels) {
      createdHotels.push(await this.hotelRepository.create(hotel));
    }
    return createdHotels;
  }
  async findAll(): Promise<Hotel[]> {
    return this.hotelRepository.findAll();
  }
}
