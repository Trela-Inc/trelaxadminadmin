import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { MasterWithParent } from '../../common/schemas/base-master.schema';
import { MasterType, MasterStatus } from '../../common/enums/master-types.enum';

/**
 * Location Document type for TypeScript
 */
export type LocationDocument = Location & Document;

/**
 * Location Schema
 * Extends MasterWithParent to include city relationship
 */
@Schema({
  timestamps: true,
  collection: 'masters',
  discriminatorKey: 'masterType'
})
export class Location extends MasterWithParent {
  // Inherited from MasterWithParent:
  // - name: string (required) - Location name like 'Bandra', 'Andheri'
  // - description?: string - Location description
  // - code?: string - Unique location code like 'BAN', 'AND'
  // - masterType: MasterType (will be set to LOCATION)
  // - status: MasterStatus (ACTIVE/INACTIVE/ARCHIVED)
  // - sortOrder?: number
  // - isDefault?: boolean
  // - isPopular?: boolean
  // - metadata?: Record<string, any>
  // - parentId: Types.ObjectId (reference to City)
  // - parentType: MasterType (will be set to CITY)

  @Prop({
    required: true,
    type: String,
    enum: Object.values(MasterType),
    default: MasterType.LOCATION,
    immutable: true
  })
  masterType: MasterType.LOCATION;

  @Prop({ 
    required: true, 
    type: Types.ObjectId,
    ref: 'City',
    index: true 
  })
  parentId: Types.ObjectId; // Reference to City

  @Prop({
    required: true,
    type: String,
    enum: Object.values(MasterType),
    default: MasterType.CITY,
    immutable: true
  })
  parentType: MasterType.CITY;

  // Location-specific fields
  @Prop({ 
    required: false, 
    trim: true, 
    maxlength: 20 
  })
  locationCode?: string; // Unique location code within the city

  @Prop({ 
    required: false, 
    type: [Number], 
    validate: [arrayLimit, 'Coordinates must have exactly 2 elements'],
    index: '2dsphere' 
  })
  coordinates?: [number, number]; // [longitude, latitude]

  @Prop({ 
    required: false, 
    trim: true, 
    maxlength: 200 
  })
  address?: string; // Full address of the location

  @Prop({ 
    required: false, 
    trim: true, 
    maxlength: 20 
  })
  pincode?: string;

  @Prop({ 
    required: false, 
    trim: true, 
    maxlength: 100 
  })
  landmark?: string; // Nearby landmark

  @Prop({ 
    required: false, 
    type: [String],
    default: [] 
  })
  alternateNames?: string[]; // Alternative names for the location

  // Location type and category
  @Prop({ 
    required: false, 
    trim: true, 
    maxlength: 50,
    enum: [
      'residential', 
      'commercial', 
      'mixed', 
      'industrial', 
      'it_hub', 
      'business_district',
      'suburb',
      'downtown',
      'waterfront',
      'hillside'
    ]
  })
  locationType?: string;

  @Prop({ 
    required: false, 
    trim: true, 
    maxlength: 50,
    enum: [
      'prime', 
      'premium', 
      'mid_range', 
      'budget', 
      'luxury', 
      'affordable',
      'upcoming',
      'established'
    ]
  })
  locationCategory?: string;

  // Connectivity and infrastructure
  @Prop({ 
    required: false, 
    type: Object,
    default: {} 
  })
  connectivity?: {
    nearestMetroStation?: string;
    metroDistance?: number; // in km
    nearestRailwayStation?: string;
    railwayDistance?: number; // in km
    nearestAirport?: string;
    airportDistance?: number; // in km
    majorRoads?: string[];
    busConnectivity?: string[];
  };

  // Real estate specific data
  @Prop({ 
    required: false, 
    type: Object,
    default: {} 
  })
  realEstateData?: {
    averagePropertyPrice?: number; // per sq ft
    priceRange?: {
      min: number;
      max: number;
    };
    priceAppreciationRate?: number; // percentage
    rentalYield?: number; // percentage
    popularPropertyTypes?: string[]; // apartment, villa, plot, etc.
    upcomingProjects?: number;
    totalProjects?: number;
    occupancyRate?: number; // percentage
  };

  // Amenities and facilities nearby
  @Prop({ 
    required: false, 
    type: Object,
    default: {} 
  })
  nearbyFacilities?: {
    schools?: string[];
    hospitals?: string[];
    shoppingMalls?: string[];
    restaurants?: string[];
    banks?: string[];
    parks?: string[];
    gyms?: string[];
    temples?: string[];
  };

  // Demographics and lifestyle
  @Prop({ 
    required: false, 
    type: Object,
    default: {} 
  })
  demographics?: {
    population?: number;
    averageAge?: number;
    familyOriented?: boolean;
    professionalHub?: boolean;
    studentPopulation?: number;
    seniorCitizens?: number;
  };

  // Safety and environment
  @Prop({ 
    required: false, 
    type: Object,
    default: {} 
  })
  safetyData?: {
    safetyRating?: number; // 1-5 scale
    policeStation?: string;
    fireBrigade?: string;
    crimeRate?: string; // low, medium, high
    streetLighting?: string; // excellent, good, average, poor
    cctvCoverage?: boolean;
  };

  // Investment and market data
  @Prop({ 
    required: false, 
    type: Object,
    default: {} 
  })
  investmentData?: {
    investmentPotential?: string; // high, medium, low
    liquidityIndex?: number; // 1-10 scale
    capitalAppreciation?: number; // percentage
    rentalDemand?: string; // high, medium, low
    futureGrowthProspects?: string[];
    governmentProjects?: string[];
  };

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
    type: [String],
    default: [] 
  })
  seoKeywords?: string[];

  @Prop({ 
    required: false, 
    trim: true 
  })
  featuredImage?: string; // S3 URL for location image

  @Prop({ 
    required: false, 
    type: [String],
    default: [] 
  })
  gallery?: string[]; // S3 URLs for location gallery images

  // Timestamps (automatically added by timestamps: true)
  createdAt?: Date;
  updatedAt?: Date;
}

// Validation function for coordinates array
function arrayLimit(val: number[]) {
  return val.length === 2;
}

/**
 * Create and export the Location schema
 */
export const LocationSchema = SchemaFactory.createForClass(Location);

// Add indexes for better query performance
LocationSchema.index({ name: 1, parentId: 1 }, { unique: true });
LocationSchema.index({ locationCode: 1, parentId: 1 }, { unique: true, sparse: true });
LocationSchema.index({ parentId: 1, status: 1 });
LocationSchema.index({ locationType: 1, locationCategory: 1 });
LocationSchema.index({ isPopular: 1, status: 1 });
LocationSchema.index({ coordinates: '2dsphere' });
LocationSchema.index({ pincode: 1 });
LocationSchema.index({ 'realEstateData.averagePropertyPrice': 1 });
LocationSchema.index({ 'investmentData.investmentPotential': 1 });

// Add text index for search functionality
LocationSchema.index({
  name: 'text',
  description: 'text',
  address: 'text',
  landmark: 'text',
  alternateNames: 'text',
  seoKeywords: 'text'
}, {
  weights: {
    name: 10,
    alternateNames: 8,
    landmark: 6,
    address: 5,
    description: 3,
    seoKeywords: 2
  },
  name: 'location_text_index'
});

// Pre-save middleware to set masterType and parentType
LocationSchema.pre('save', function(next) {
  if (this.isNew) {
    this.masterType = MasterType.LOCATION;
    this.parentType = MasterType.CITY;
  }
  next();
});

// Virtual for full location name with city
LocationSchema.virtual('fullName').get(function() {
  return this.populated('parentId') && this.parentId && typeof this.parentId === 'object' && 'name' in this.parentId
    ? `${this.name}, ${(this.parentId as any).name}`
    : this.name;
});

// Virtual for location coordinates in GeoJSON format
LocationSchema.virtual('geoLocation').get(function() {
  if (this.coordinates && this.coordinates.length === 2) {
    return {
      type: 'Point',
      coordinates: this.coordinates
    };
  }
  return null;
});

// Ensure virtuals are included in JSON output
LocationSchema.set('toJSON', { virtuals: true });
LocationSchema.set('toObject', { virtuals: true });
