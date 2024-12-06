import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CreateHotelDto } from './dto/hotel.dto';
import { HotelService } from './hotels.service';
import { JWtGuard } from '../auth/guard/jwt.guard';

@Controller('hotels')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JWtGuard)
  async createHotels(@Body() hotels: CreateHotelDto[]) {
    const createdHotels = await this.hotelService.createHotels(hotels);
    return {
      message: 'Hotels received and saved successfully',
      count: createdHotels.length,
    };
  }
}
