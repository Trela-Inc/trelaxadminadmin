import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { MasterWithCategory } from '../../common/schemas/base-master.schema';
import { MasterType, AmenityCategory } from '../../common/enums/master-types.enum';

/**
 * Amenity Document type for TypeScript
 */
export type AmenityDocument = Amenity & Document;

/**
 * Amenity Schema
 * Extends MasterWithCategory to include categorization
 */
@Schema({
  timestamps: true,
  collection: 'masters',
  discriminatorKey: 'masterType'
})
export class Amenity extends MasterWithCategory {
  // Inherited from MasterWithCategory:
  // - name: string (required) - Amenity name like 'Swimming Pool', 'Gym'
  // - description?: string - Amenity description
  // - code?: string - Unique amenity code like 'POOL', 'GYM'
  // - masterType: MasterType (will be set to AMENITY)
  // - status: MasterStatus (ACTIVE/INACTIVE/ARCHIVED)
  // - sortOrder?: number
  // - isDefault?: boolean
  // - isPopular?: boolean
  // - metadata?: Record<string, any>
  // - category?: string - Amenity category
  // - icon?: string - Icon identifier
  // - color?: string - Color code

  @Prop({
    required: true,
    type: String,
    enum: Object.values(MasterType),
    default: MasterType.AMENITY,
    immutable: true
  })
  masterType: MasterType.AMENITY;

  @Prop({
    required: false,
    type: String,
    enum: Object.values(AmenityCategory),
    index: true
  })
  category: AmenityCategory;

  // Amenity-specific fields
  @Prop({ 
    required: false, 
    trim: true, 
    maxlength: 50 
  })
  icon?: string; // Icon identifier like 'swimming-pool', 'gym', 'parking'

  @Prop({ 
    required: false, 
    trim: true, 
    maxlength: 10 
  })
  color?: string; // Color code for UI display

  @Prop({ 
    required: false, 
    type: [String],
    default: [] 
  })
  tags?: string[]; // Additional tags for filtering

  @Prop({ 
    required: false, 
    type: Object,
    default: {} 
  })
  specifications?: {
    size?: string; // e.g., "Olympic size", "25m x 15m"
    capacity?: number; // e.g., 50 people for gym
    operatingHours?: string; // e.g., "6 AM - 10 PM"
    maintenanceFee?: number; // Monthly maintenance cost
    features?: string[]; // Additional features
  };

  @Prop({ 
    required: false, 
    type: Object,
    default: {} 
  })
  availability?: {
    residential?: boolean; // Available in residential projects
    commercial?: boolean; // Available in commercial projects
    luxury?: boolean; // Premium/luxury amenity
    basic?: boolean; // Basic amenity
  };

  @Prop({ 
    required: false, 
    min: 1, 
    max: 5 
  })
  importanceLevel?: number; // 1-5 scale, 5 being most important

  @Prop({ 
    required: false, 
    min: 0, 
    max: 100 
  })
  popularityScore?: number; // Popularity percentage

  @Prop({ 
    required: false, 
    type: [String],
    default: [] 
  })
  relatedAmenities?: string[]; // Related amenity names

  @Prop({ 
    required: false, 
    type: [String],
    default: [] 
  })
  keywords?: string[]; // Search keywords

  // SEO and marketing data
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
  featuredImage?: string; // S3 URL for amenity image

  @Prop({ 
    required: false, 
    type: [String],
    default: [] 
  })
  gallery?: string[]; // S3 URLs for amenity gallery images

  // Timestamps (automatically added by timestamps: true)
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Create and export the Amenity schema
 */
export const AmenitySchema = SchemaFactory.createForClass(Amenity);

// Add indexes for better query performance
AmenitySchema.index({ name: 1 }, { unique: true });
AmenitySchema.index({ code: 1 }, { unique: true, sparse: true });
AmenitySchema.index({ category: 1, status: 1 });
AmenitySchema.index({ isPopular: 1, status: 1 });
AmenitySchema.index({ importanceLevel: 1 });
AmenitySchema.index({ popularityScore: 1 });
AmenitySchema.index({ tags: 1 });
AmenitySchema.index({ 'availability.residential': 1 });
AmenitySchema.index({ 'availability.commercial': 1 });
AmenitySchema.index({ 'availability.luxury': 1 });

// Add text index for search functionality
AmenitySchema.index({
  name: 'text',
  description: 'text',
  tags: 'text',
  keywords: 'text',
  relatedAmenities: 'text'
}, {
  weights: {
    name: 10,
    tags: 8,
    keywords: 6,
    description: 4,
    relatedAmenities: 2
  },
  name: 'amenity_text_index'
});

// Pre-save middleware to set masterType
AmenitySchema.pre('save', function(next) {
  if (this.isNew) {
    this.masterType = MasterType.AMENITY;
  }
  next();
});

// Virtual for amenity display name with category
AmenitySchema.virtual('displayName').get(function() {
  return this.category 
    ? `${this.name} (${this.category})` 
    : this.name;
});

// Virtual for amenity importance text
AmenitySchema.virtual('importanceText').get(function() {
  if (!this.importanceLevel) return 'Not specified';
  
  const levels = {
    1: 'Low',
    2: 'Below Average',
    3: 'Average',
    4: 'High',
    5: 'Critical'
  };
  
  return levels[this.importanceLevel] || 'Not specified';
});

// Virtual for popularity text
AmenitySchema.virtual('popularityText').get(function() {
  if (!this.popularityScore) return 'Not specified';
  
  if (this.popularityScore >= 80) return 'Very Popular';
  if (this.popularityScore >= 60) return 'Popular';
  if (this.popularityScore >= 40) return 'Moderately Popular';
  if (this.popularityScore >= 20) return 'Less Popular';
  return 'Rarely Requested';
});

// Ensure virtuals are included in JSON output
AmenitySchema.set('toJSON', { virtuals: true });
AmenitySchema.set('toObject', { virtuals: true });
