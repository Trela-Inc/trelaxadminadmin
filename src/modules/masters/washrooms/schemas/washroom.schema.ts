import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { MasterWithNumericValue } from '../../common/schemas/base-master.schema';
import { MasterType } from '../../common/enums/master-types.enum';

export type WashroomDocument = Washroom & Document;

@Schema({
  timestamps: true,
  collection: 'masters',
  discriminatorKey: 'masterType'
})
export class Washroom extends MasterWithNumericValue {
  @Prop({ 
    required: true,
    type: String,
    enum: Object.values(MasterType),
    default: MasterType.WASHROOM,
    immutable: true
  })
  masterType: MasterType.WASHROOM;

  @Prop({ 
    required: false,
    index: true 
  })
  numericValue?: number; // Number of washrooms: 1, 2, 3, etc.

  @Prop({ 
    required: false, 
    trim: true, 
    maxlength: 20,
    default: 'Bathroom'
  })
  unit?: string; // 'Bathroom', 'Washroom', 'Toilet'

  @Prop({ 
    required: false, 
    trim: true, 
    maxlength: 50,
    enum: ['attached', 'common', 'powder_room', 'master_bathroom', 'guest_bathroom']
  })
  washroomType?: string;

  @Prop({ 
    required: false, 
    type: [String],
    default: [] 
  })
  features?: string[]; // ['bathtub', 'shower', 'geyser', 'exhaust_fan']

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

  @Prop({ 
    required: false, 
    type: Object,
    default: {} 
  })
  specifications?: {
    hasShower?: boolean;
    hasBathtub?: boolean;
    hasGeyser?: boolean;
    hasExhaustFan?: boolean;
    hasWindow?: boolean;
    fittingsQuality?: string; // 'basic', 'premium', 'luxury'
  };

  createdAt?: Date;
  updatedAt?: Date;
}

export const WashroomSchema = SchemaFactory.createForClass(Washroom);

WashroomSchema.index({ numericValue: 1 }, { unique: true });
WashroomSchema.index({ code: 1 }, { unique: true, sparse: true });
WashroomSchema.index({ washroomType: 1, status: 1 });

WashroomSchema.pre('save', function(next) {
  if (this.isNew) {
    this.masterType = MasterType.WASHROOM;
  }
  next();
});

WashroomSchema.virtual('displayName').get(function() {
  return this.numericValue 
    ? `${this.numericValue} ${this.unit || 'Bathroom'}` 
    : this.name;
});

WashroomSchema.set('toJSON', { virtuals: true });
WashroomSchema.set('toObject', { virtuals: true });
