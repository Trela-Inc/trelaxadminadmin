import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { MasterWithNumericValue } from '../../common/schemas/base-master.schema';
import { MasterType } from '../../common/enums/master-types.enum';

/**
 * Floor Document type for TypeScript
 */
export type FloorDocument = Floor & Document;

/**
 * Floor Schema
 * Extends MasterWithNumericValue for floor numbers and ranges
 */
@Schema({
  timestamps: true,
  collection: 'masters',
  discriminatorKey: 'masterType'
})
export class Floor extends MasterWithNumericValue {
  // Inherited from MasterWithNumericValue:
  // - name: string (required) - Floor name like 'Ground Floor', '1st Floor', 'Basement'
  // - description?: string - Floor description
  // - code?: string - Unique floor code like 'GF', '1F', 'B1'
  // - masterType: MasterType (will be set to FLOOR)
  // - status: MasterStatus (ACTIVE/INACTIVE/ARCHIVED)
  // - sortOrder?: number
  // - isDefault?: boolean
  // - isPopular?: boolean
  // - metadata?: Record<string, any>
  // - numericValue?: number - Floor number (0 for ground, -1 for basement, etc.)
  // - unit?: string - Unit like 'Floor', 'Level'
  // - minValue?: number - Minimum floor in range
  // - maxValue?: number - Maximum floor in range

  @Prop({
    required: true,
    type: String,
    enum: Object.values(MasterType),
    default: MasterType.FLOOR,
    immutable: true
  })
  masterType: MasterType.FLOOR;

  @Prop({ 
    required: false,
    index: true 
  })
  numericValue?: number; // Floor number: -2, -1, 0, 1, 2, etc.

  @Prop({ 
    required: false, 
    trim: true, 
    maxlength: 20,
    default: 'Floor'
  })
  unit?: string; // 'Floor', 'Level', 'Story'

  // Floor-specific fields
  @Prop({ 
    required: false, 
    trim: true, 
    maxlength: 50,
    enum: [
      'basement', 
      'ground', 
      'mezzanine', 
      'regular', 
      'penthouse', 
      'rooftop',
      'parking',
      'mechanical',
      'terrace'
    ]
  })
  floorType?: string;

  @Prop({ 
    required: false, 
    trim: true, 
    maxlength: 50,
    enum: [
      'residential', 
      'commercial', 
      'mixed', 
      'parking', 
      'amenity', 
      'mechanical',
      'retail',
      'office'
    ]
  })
  usage?: string;

  @Prop({ 
    required: false 
  })
  height?: number; // Floor height in feet

  @Prop({ 
    required: false 
  })
  area?: number; // Floor area in sq ft

  @Prop({ 
    required: false, 
    type: Object,
    default: {} 
  })
  specifications?: {
    ceilingHeight?: number; // in feet
    loadCapacity?: number; // in kg/sq meter
    fireRating?: string; // fire safety rating
    accessibility?: boolean; // wheelchair accessible
    hvacType?: string; // HVAC system type
    electricalLoad?: number; // in KW
  };

  @Prop({ 
    required: false, 
    type: Object,
    default: {} 
  })
  amenities?: {
    elevator?: boolean;
    escalator?: boolean;
    fireExit?: boolean;
    emergencyStaircase?: boolean;
    restrooms?: boolean;
    powerBackup?: boolean;
  };

  @Prop({ 
    required: false, 
    type: [String],
    default: [] 
  })
  restrictions?: string[]; // Usage restrictions or regulations

  @Prop({ 
    required: false, 
    type: [String],
    default: [] 
  })
  features?: string[]; // Special features of the floor

  // Pricing and valuation
  @Prop({ 
    required: false 
  })
  priceMultiplier?: number; // Price multiplier compared to base floor

  @Prop({ 
    required: false 
  })
  premiumPercentage?: number; // Premium percentage for this floor

  // Availability and booking
  @Prop({ 
    required: false, 
    default: true 
  })
  isAvailable?: boolean;

  @Prop({ 
    required: false 
  })
  maxUnitsPerFloor?: number; // Maximum units that can be on this floor

  // SEO and display
  @Prop({ 
    required: false, 
    trim: true, 
    maxlength: 100 
  })
  displayName?: string; // Display name for UI

  @Prop({ 
    required: false, 
    trim: true, 
    maxlength: 200 
  })
  shortDescription?: string; // Short description for listings

  // Timestamps (automatically added by timestamps: true)
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Create and export the Floor schema
 */
export const FloorSchema = SchemaFactory.createForClass(Floor);

// Add indexes for better query performance
FloorSchema.index({ numericValue: 1 }, { unique: true });
FloorSchema.index({ code: 1 }, { unique: true, sparse: true });
FloorSchema.index({ floorType: 1, status: 1 });
FloorSchema.index({ usage: 1, status: 1 });
FloorSchema.index({ isAvailable: 1, status: 1 });
FloorSchema.index({ priceMultiplier: 1 });

// Add text index for search functionality
FloorSchema.index({
  name: 'text',
  description: 'text',
  displayName: 'text',
  shortDescription: 'text',
  features: 'text'
}, {
  weights: {
    name: 10,
    displayName: 8,
    shortDescription: 5,
    description: 3,
    features: 2
  },
  name: 'floor_text_index'
});

// Pre-save middleware to set masterType and generate display name
FloorSchema.pre('save', function(next) {
  if (this.isNew) {
    this.masterType = MasterType.FLOOR;
  }
  
  // Auto-generate display name if not provided
  if (!this.displayName && this.numericValue !== undefined) {
    if (this.numericValue === 0) {
      this.displayName = 'Ground Floor';
    } else if (this.numericValue < 0) {
      this.displayName = `Basement ${Math.abs(this.numericValue)}`;
    } else {
      const suffix = this.numericValue === 1 ? 'st' : 
                    this.numericValue === 2 ? 'nd' : 
                    this.numericValue === 3 ? 'rd' : 'th';
      this.displayName = `${this.numericValue}${suffix} Floor`;
    }
  }
  
  next();
});

// Virtual for floor level description
FloorSchema.virtual('levelDescription').get(function() {
  if (this.numericValue === undefined) return 'Not specified';
  
  if (this.numericValue < 0) {
    return `Basement Level ${Math.abs(this.numericValue)}`;
  } else if (this.numericValue === 0) {
    return 'Ground Level';
  } else {
    return `${this.numericValue} floors above ground`;
  }
});

// Virtual for accessibility info
FloorSchema.virtual('accessibilityInfo').get(function() {
  const info = [];
  
  if (this.amenities?.elevator) info.push('Elevator Access');
  if (this.amenities?.escalator) info.push('Escalator Access');
  if (this.specifications?.accessibility) info.push('Wheelchair Accessible');
  if (this.amenities?.emergencyStaircase) info.push('Emergency Staircase');
  
  return info.length > 0 ? info.join(', ') : 'Standard Access';
});

// Ensure virtuals are included in JSON output
FloorSchema.set('toJSON', { virtuals: true });
FloorSchema.set('toObject', { virtuals: true });
