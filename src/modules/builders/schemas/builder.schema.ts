import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BuilderDocument = Builder & Document;

@Schema({
  timestamps: true,
  collection: 'builders',
})
export class Builder {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: false, trim: true })
  description?: string;

  @Prop({ required: false, trim: true })
  website?: string;

  @Prop({ required: false, trim: true })
  contactEmail?: string;

  @Prop({ required: false, trim: true })
  contactPhone?: string;

  @Prop({ required: false, trim: true })
  logo?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const BuilderSchema = SchemaFactory.createForClass(Builder); 