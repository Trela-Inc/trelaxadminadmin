import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { MasterWithNumericValue } from '../../common/schemas/base-master.schema';
import { MasterType } from '../../common/enums/master-types.enum';

export type RoomDocument = Room & Document;

@Schema({
  timestamps: true,
  collection: 'masters',
  discriminatorKey: 'masterType'
})
export class Room extends MasterWithNumericValue {
  @Prop({ 
    required: true,
    type: String,
    enum: Object.values(MasterType),
    default: MasterType.ROOM,
    immutable: true
  })
  masterType: MasterType.ROOM;

  @Prop({ 
    required: false,
    index: true 
  })
  numericValue?: number; // Number of rooms: 1, 2, 3, etc.

  @Prop({ 
    required: false, 
    trim: true, 
    maxlength: 20,
    default: 'BHK'
  })
  unit?: string; // 'BHK', 'Bedroom', 'Room'

  @Prop({ 
    required: false, 
    trim: true, 
    maxlength: 50,
    enum: ['studio', '1bhk', '2bhk', '3bhk', '4bhk', '5bhk', 'penthouse']
  })
  roomType?: string;

  @Prop({ 
    required: false, 
    type: [String],
    default: [] 
  })
  features?: string[];

  @Prop({ 
    required: false 
  })
  typicalArea?: number; // Typical area in sq ft

  @Prop({ 
    required: false, 
    min: 1, 
    max: 5 
  })
  popularityRating?: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export const RoomSchema = SchemaFactory.createForClass(Room);

RoomSchema.index({ numericValue: 1 }, { unique: true });
RoomSchema.index({ code: 1 }, { unique: true, sparse: true });
RoomSchema.index({ roomType: 1, status: 1 });

RoomSchema.pre('save', function(next) {
  if (this.isNew) {
    this.masterType = MasterType.ROOM;
  }
  next();
});

RoomSchema.virtual('displayName').get(function() {
  return this.numericValue 
    ? `${this.numericValue} ${this.unit || 'BHK'}` 
    : this.name;
});

RoomSchema.set('toJSON', { virtuals: true });
RoomSchema.set('toObject', { virtuals: true });
