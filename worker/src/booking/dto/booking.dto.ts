import {
  IsNotEmpty,
  IsEmail,
  IsDate,
  IsNumber,
  IsString,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookingDto {
  @IsOptional()
  _id?: string;

  @IsNotEmpty()
  hotel: string;

  @IsNotEmpty()
  serialNumber: string;

  @IsNotEmpty()
  @IsString()
  guestName: string;

  @IsOptional()
  @IsEmail()
  guestEmail?: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  checkInDate: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  checkOutDate: Date;

  @IsNotEmpty()
  @IsString()
  roomCategory: string;

  @IsNotEmpty()
  @IsString()
  numberOfRooms: string;

  @IsNotEmpty()
  @IsString()
  numberOfPersons: string;

  @IsNotEmpty()
  @IsNumber()
  bookingAmount: number;

  @IsNotEmpty()
  @IsNumber()
  advanceAmount: number;

  @IsNotEmpty()
  @IsNumber()
  dueAmount: number;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  advanceDate: Date;

  @IsNotEmpty()
  @IsString()
  bookingSource: string;

  @IsNotEmpty()
  @IsString()
  bookingBy: string;

  @IsNotEmpty()
  @IsString()
  plan: string;

  @IsNotEmpty()
  @IsString()
  contactNumber: string;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  addedBy?: string;

  @IsOptional()
  @IsEnum(['CONFIRMED', 'CANCELLED'])
  status?: string;

  @IsOptional()
  @IsString()
  accountType?: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  createdAt: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  updatedAt: Date;
}
