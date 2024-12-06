import {
  IsNotEmpty,
  IsEmail,
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsArray,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUsersDto {
  @IsOptional()
  _id?: string;

  @IsOptional()
  name: string;

  @IsNotEmpty()
  serialNumber: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  profilePic?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsNotEmpty()
  @IsEnum(['ADMIN', 'SUBADMIN', 'USER'])
  role: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  loginTime?: Date;

  @IsOptional()
  @IsString()
  addedBy?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  hotel?: string[];

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  createdAt: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  updatedAt: Date;
}
