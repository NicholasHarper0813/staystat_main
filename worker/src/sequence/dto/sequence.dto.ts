// src/sequence/dto/sequence.dto.ts

import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSequenceDto {
  @IsNotEmpty()
  @IsString()
  _id: string;

  @IsNotEmpty()
  @IsNumber()
  seq: number;
}
