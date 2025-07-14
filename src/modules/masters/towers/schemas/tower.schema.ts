import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { MasterWithNumericValue } from '../../common/schemas/base-master.schema';
import { MasterType } from '../../common/enums/master-types.enum';

/**
 * Tower Document type for TypeScript
 */
export type TowerDocument = Tower & Document;

/**
 * Tower Schema
 * Extends MasterWithNumericValue for tower numbers and specifications
 */
@Schema({
  timestamps: true,
  collection: 'masters',
  discriminatorKey: 'masterType'
})
export class Tower extends MasterWithNumericValue {
  @Prop({
    required: true,
    type: String,
    enum: Object.values(MasterType),
    default: MasterType.TOWER,
    immutable: true
  })
  masterType: MasterType.TOWER;

  @Prop({ 
    required: false,
    index: true 
  })
  numericValue?: number; // Tower number: 1, 2, 3, etc.

  @Prop({ 
    required: false, 
    trim: true, 
    maxlength: 20,
    default: 'Tower'
  })
  unit?: string; // 'Tower', 'Block', 'Wing'

  // Tower-specific fields
  @Prop({ 
    required: false, 
    trim: true, 
    maxlength: 50,
    enum: [
      'residential', 
      'commercial', 
      'mixed_use', 
      'office', 
      'retail',
      'hospitality',
      'industrial'
    ]
  })
  towerType?: string;

  @Prop({ 
    required: false 
  })
  totalFloors?: number; // Total number of floors in the tower

  @Prop({ 
    required: false 
  })
  height?: number; // Tower height in feet

  @Prop({ 
    required: false 
  })
  totalUnits?: number; // Total units in the tower

  @Prop({ 
    required: false 
  })
  unitsPerFloor?: number; // Average units per floor

  @Prop({ 
    required: false, 
    type: Object,
    default: {} 
  })
  specifications?: {
    structure?: string; // RCC, Steel, etc.
    elevators?: number;
    staircases?: number;
    parkingLevels?: number;
    totalParkingSpots?: number;
    powerBackup?: boolean;
    waterStorage?: number; // in liters
    sewageTreatment?: boolean;
    rainwaterHarvesting?: boolean;
    solarPanels?: boolean;
    greenBuilding?: boolean;
  };

  @Prop({ 
    required: false, 
    type: [String],
    default: [] 
  })
  amenities?: string[]; // Tower-specific amenities

  @Prop({ 
    required: false, 
    type: [String],
    default: [] 
  })
  features?: string[]; // Special features

  @Prop({ 
    required: false, 
    default: true 
  })
  isActive?: boolean;

  @Prop({ 
    required: false 
  })
  constructionYear?: number;

  @Prop({ 
    required: false, 
    trim: true, 
    maxlength: 100 
  })
  architect?: string;

  @Prop({ 
    required: false, 
    trim: true, 
    maxlength: 100 
  })
  contractor?: string;

  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
}

export const TowerSchema = SchemaFactory.createForClass(Tower);

// Indexes
TowerSchema.index({ numericValue: 1 }, { unique: true });
TowerSchema.index({ code: 1 }, { unique: true, sparse: true });
TowerSchema.index({ towerType: 1, status: 1 });
TowerSchema.index({ isActive: 1, status: 1 });

// Pre-save middleware
TowerSchema.pre('save', function(next) {
  if (this.isNew) {
    this.masterType = MasterType.TOWER;
  }
  next();
});

// Virtuals
TowerSchema.virtual('displayName').get(function() {
  return this.numericValue 
    ? `${this.unit || 'Tower'} ${this.numericValue}` 
    : this.name;
});

TowerSchema.set('toJSON', { virtuals: true });
TowerSchema.set('toObject', { virtuals: true });
