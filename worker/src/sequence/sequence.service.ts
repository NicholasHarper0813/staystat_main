// src/sequence/sequence.service.ts

import { Injectable } from '@nestjs/common';
import { CreateSequenceDto } from './dto/sequence.dto';
import { SequenceRepository } from './repository/sequence.repository';
import { Sequence } from './model/sequence.model';

@Injectable()
export class SequenceService {
  constructor(private readonly sequenceRepository: SequenceRepository) {}

  async createSequences(sequences: CreateSequenceDto[]): Promise<Sequence[]> {
    await this.sequenceRepository.deleteAll();
    const createdSequences = [];
    for (const sequence of sequences) {
      createdSequences.push(await this.sequenceRepository.create(sequence));
    }
    return createdSequences;
  }
  async findAll(): Promise<Sequence[]> {
    return this.sequenceRepository.findAll();
  }
}
