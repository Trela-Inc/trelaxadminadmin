import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { MasterWithCategory } from '../../common/schemas/base-master.schema';
import { MasterType, PropertyTypeCategory } from '../../common/enums/master-types.enum';

export type PropertyTypeDocument = PropertyType & Document;

@Schema({
  timestamps: true,
  collection: 'masters',
  discriminatorKey: 'masterType'
})
export class PropertyType extends MasterWithCategory {
  @Prop({
    required: true,
    type: String,
    enum: Object.values(MasterType),
    default: MasterType.PROPERTY_TYPE,
    immutable: true
  })
  masterType: MasterType.PROPERTY_TYPE;

  @Prop({
    required: false,
    type: String,
    enum: Object.values(PropertyTypeCategory),
    index: true
  })
  category: PropertyTypeCategory;

  @Prop({ 
    required: false, 
    trim: true, 
    maxlength: 50 
  })
  icon?: string;

  @Prop({ 
    required: false, 
    trim: true, 
    maxlength: 10 
  })
  color?: string;

  // Property type specific fields
  @Prop({ 
    required: false, 
    type: [String],
    default: [] 
  })
  suitableFor?: string[]; // ['investment', 'residence', 'commercial_use']

  @Prop({ 
    required: false, 
    type: Object,
    default: {} 
  })
  specifications?: {
    minArea?: number; // in sq ft
    maxArea?: number; // in sq ft
    typicalFloors?: number;
    parkingSpaces?: number;
    balconies?: number;
    bathrooms?: number;
    bedrooms?: number;
  };

  @Prop({ 
    required: false, 
    type: [String],
    default: [] 
  })
  features?: string[]; // ['garden', 'terrace', 'pool', 'gym']

  @Prop({
    required: false,
    type: Object,
    default: {}
  })
  priceRange?: {
    min?: number;
    max?: number;
    currency?: string;
  };

  @Prop({ 
    required: false, 
    min: 1, 
    max: 5 
  })
  popularityRating?: number;

  @Prop({ 
    required: false, 
    type: [String],
    default: [] 
  })
  targetAudience?: string[]; // ['families', 'professionals', 'investors', 'seniors']

  @Prop({ 
    required: false, 
    type: [String],
    default: [] 
  })
  legalRequirements?: string[]; // Legal or regulatory requirements

  // SEO fields
  @Prop({ 
    required: false, 
    trim: true, 
    maxlength: 200 
  })
  seoTitle?: string;

  @Prop({ 
    required: false, 
    trim: true, 
    maxlength: 500 
  })
  seoDescription?: string;

  @Prop({ 
    required: false, 
    trim: true 
  })
  featuredImage?: string;

  @Prop({ 
    required: false, 
    type: [String],
    default: [] 
  })
  gallery?: string[];

  createdAt?: Date;
  updatedAt?: Date;
}

export const PropertyTypeSchema = SchemaFactory.createForClass(PropertyType);

// Indexes
PropertyTypeSchema.index({ name: 1 }, { unique: true });
PropertyTypeSchema.index({ code: 1 }, { unique: true, sparse: true });
PropertyTypeSchema.index({ category: 1, status: 1 });
PropertyTypeSchema.index({ popularityRating: 1 });
PropertyTypeSchema.index({ suitableFor: 1 });

// Text search
PropertyTypeSchema.index({
  name: 'text',
  description: 'text',
  features: 'text',
  suitableFor: 'text',
  targetAudience: 'text'
}, {
  weights: {
    name: 10,
    suitableFor: 8,
    features: 6,
    description: 4,
    targetAudience: 2
  },
  name: 'property_type_text_index'
});

PropertyTypeSchema.pre('save', function(next) {
  if (this.isNew) {
    this.masterType = MasterType.PROPERTY_TYPE;
  }
  next();
});

PropertyTypeSchema.virtual('displayName').get(function() {
  return this.category 
    ? `${this.name} (${this.category})` 
    : this.name;
});

PropertyTypeSchema.set('toJSON', { virtuals: true });
PropertyTypeSchema.set('toObject', { virtuals: true });
