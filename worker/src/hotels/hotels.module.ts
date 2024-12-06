import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HotelController } from './hotels.controller';
import { Hotel, HotelSchema } from './model/hotel.model';
import { HotelService } from './hotels.service';
import { HotelRepository } from './repository/hotel.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Hotel.name, schema: HotelSchema }]),
  ],
  controllers: [HotelController],
  providers: [HotelService, HotelRepository],
})
export class HotelsModule {}
