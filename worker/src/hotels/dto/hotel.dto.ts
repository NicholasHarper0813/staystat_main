import {
  IsNotEmpty,
  IsEmail,
  IsBoolean,
  IsString,
  IsOptional,
  IsArray,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';

class OwnerContactDto {
  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}

export class CreateHotelDto {
  @IsOptional()
  _id?: string;

  @IsNotEmpty()
  @IsString()
  hotelName: string;

  @IsNotEmpty()
  serialNumber: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsString()
  ownerName: string;

  @IsNotEmpty()
  @Type(() => OwnerContactDto)
  ownerContact: OwnerContactDto;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsNotEmpty()
  @IsString()
  GSTNumber: string;

  @IsNotEmpty()
  @IsString()
  panNumber: string;

  @IsNotEmpty()
  @IsString()
  aadharNumber: string;

  @IsNotEmpty()
  @IsString()
  tradeLicense: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roomCategories?: string[];

  @IsNotEmpty()
  @IsString()
  bank: string;

  @IsNotEmpty()
  @IsString()
  accountNumber: string;

  @IsNotEmpty()
  @IsString()
  ifscCode: string;

  @IsOptional()
  @IsString()
  otherDocuments?: string;

  @IsOptional()
  @IsString()
  documentId?: string;

  @IsNotEmpty()
  @IsString()
  frontOfficeContact: string;

  @IsOptional()
  @IsString()
  addedBy?: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  createdAt: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  updatedAt: Date;
}
