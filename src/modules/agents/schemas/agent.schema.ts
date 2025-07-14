import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AgentDocument = Agent & Document;

@Schema({
  timestamps: true,
  collection: 'agents',
})
export class Agent {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: false, trim: true })
  description?: string;

  @Prop({ required: false, trim: true })
  email?: string;

  @Prop({ required: false, trim: true })
  phone?: string;

  @Prop({ required: false, trim: true })
  address?: string;

  @Prop({ required: false, trim: true })
  licenseNumber?: string;

  @Prop({ required: false, trim: true })
  profileImage?: string;

  @Prop({ required: false, default: true })
  isActive?: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export const AgentSchema = SchemaFactory.createForClass(Agent); 