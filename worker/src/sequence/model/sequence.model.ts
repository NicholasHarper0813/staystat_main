// src/sequence/model/sequence.model.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Sequence extends Document {
  @Prop({ required: true })
  _id: string;

  @Prop({ default: 0 })
  seq: number;
}

export const SequenceSchema = SchemaFactory.createForClass(Sequence);
