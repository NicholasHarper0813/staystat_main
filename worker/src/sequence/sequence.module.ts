import { Module } from '@nestjs/common';
import { SequenceService } from './sequence.service';
import { SequenceController } from './sequence.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Sequence, SequenceSchema } from './model/sequence.model';
import { SequenceRepository } from './repository/sequence.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Sequence.name, schema: SequenceSchema },
    ]),
  ],
  controllers: [SequenceController],
  providers: [SequenceService, SequenceRepository],
})
export class SequenceModule {}
