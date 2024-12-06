// src/sequence/repository/sequence.repository.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sequence } from '../model/sequence.model';
import { CreateSequenceDto } from '../dto/sequence.dto';

@Injectable()
export class SequenceRepository {
  constructor(
    @InjectModel(Sequence.name) private readonly sequenceModel: Model<Sequence>,
  ) {}

  async create(createSequenceDto: CreateSequenceDto): Promise<Sequence> {
    const createdSequence = new this.sequenceModel(createSequenceDto);
    return createdSequence.save();
  }
  async findAll(): Promise<Sequence[]> {
    return this.sequenceModel.find({});
  }

  async findByIdAndUpdate(id: string, increment: number): Promise<Sequence> {
    return this.sequenceModel
      .findByIdAndUpdate(
        id,
        { $inc: { seq: increment } },
        { new: true, upsert: true },
      )
      .exec();
  }

  async deleteAll(): Promise<void> {
    await this.sequenceModel.deleteMany({}).exec();
  }
}
