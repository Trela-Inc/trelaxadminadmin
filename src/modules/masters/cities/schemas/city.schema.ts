import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { MasterWithLocation } from '../../common/schemas/base-master.schema';
import { MasterType, MasterStatus } from '../../common/enums/master-types.enum';

/**
 * City Document type for TypeScript
 */
export type CityDocument = City & Document;

/**
 * City Schema
 * Extends MasterWithLocation to include geographical information
 */
@Schema({
  timestamps: true,
  collection: 'masters',
  discriminatorKey: 'masterType'
})
export class City extends MasterWithLocation {
  // Inherited from MasterWithLocation:
  // - name: string (required)
  // - description?: string
  // - code?: string (unique city code like 'MUM', 'DEL')
  // - masterType: MasterType (will be set to CITY)
  // - status: MasterStatus (ACTIVE/INACTIVE/ARCHIVED)
  // - sortOrder?: number
  // - isDefault?: boolean
  // - isPopular?: boolean
  // - metadata?: Record<string, any>
  // - state?: string (required for cities)
  // - country?: string (required for cities)
  // - coordinates?: [number, number] (longitude, latitude)
  // - timezone?: string
  // - pinCodes?: string[]

  // City-specific fields
  @Prop({ 
    required: true, 
    trim: true, 
    maxlength: 100,
    index: true 
  })
  state: string;

  @Prop({ 
    required: true, 
    trim: true, 
    maxlength: 100,
    index: true,
    default: 'India'
  })
  country: string;

  @Prop({
    required: true,
    type: String,
    enum: Object.values(MasterType),
    default: MasterType.CITY,
    immutable: true
  })
  masterType: MasterType.CITY;

  @Prop({ 
    required: false, 
    trim: true, 
    maxlength: 20 
  })
  stateCode?: string; // State code like 'MH', 'DL'

  @Prop({ 
    required: false, 
    trim: true, 
    maxlength: 10 
  })
  countryCode?: string; // Country code like 'IN', 'US'

  @Prop({ 
    required: false,
    min: 0
  })
  population?: number;

  @Prop({ 
    required: false,
    min: 0
  })
  area?: number; // Area in square kilometers

  @Prop({ 
    required: false, 
    trim: true, 
    maxlength: 100 
  })
  majorLanguage?: string;

  @Prop({ 
    required: false, 
    type: [String],
    default: [] 
  })
  alternateNames?: string[]; // Alternative names for the city

  @Prop({ 
    required: false, 
    type: Object,
    default: {} 
  })
  economicData?: {
    gdp?: number;
    majorIndustries?: string[];
    economicGrowthRate?: number;
  };

  @Prop({ 
    required: false, 
    type: Object,
    default: {} 
  })
  climateData?: {
    averageTemperature?: number;
    rainfall?: number;
    humidity?: number;
    season?: string;
  };

  @Prop({ 
    required: false, 
    type: [String],
    default: [] 
  })
  nearbyAirports?: string[]; // Airport codes

  @Prop({ 
    required: false, 
    type: [String],
    default: [] 
  })
  majorRailwayStations?: string[];

  @Prop({ 
    required: false, 
    type: [String],
    default: [] 
  })
  highways?: string[]; // Major highways passing through

  // Real estate specific data
  @Prop({ 
    required: false, 
    type: Object,
    default: {} 
  })
  realEstateData?: {
    averagePropertyPrice?: number;
    priceAppreciationRate?: number;
    rentalYield?: number;
    popularAreas?: string[];
    upcomingProjects?: number;
  };

  // Administrative data
  @Prop({ 
    required: false, 
    trim: true, 
    maxlength: 100 
  })
  district?: string;

  @Prop({ 
    required: false, 
    trim: true, 
    maxlength: 100 
  })
  division?: string;

  @Prop({ 
    required: false, 
    type: [String],
    default: [] 
  })
  neighboringCities?: string[];

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
  featuredImage?: string; // S3 URL for city image

  @Prop({ 
    required: false, 
    type: [String],
    default: [] 
  })
  gallery?: string[]; // S3 URLs for city gallery images

  // Timestamps (automatically added by timestamps: true)
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Create and export the City schema
 */
export const CitySchema = SchemaFactory.createForClass(City);

// Add indexes for better query performance
CitySchema.index({ name: 1, state: 1 }, { unique: true });
CitySchema.index({ code: 1 }, { unique: true, sparse: true });
CitySchema.index({ state: 1, country: 1 });
CitySchema.index({ isPopular: 1, status: 1 });
CitySchema.index({ coordinates: '2dsphere' });
CitySchema.index({ 'realEstateData.averagePropertyPrice': 1 });

// Add text index for search functionality
CitySchema.index({
  name: 'text',
  description: 'text',
  state: 'text',
  alternateNames: 'text',
  seoKeywords: 'text'
}, {
  weights: {
    name: 10,
    alternateNames: 8,
    state: 5,
    description: 3,
    seoKeywords: 2
  },
  name: 'city_text_index'
});

// Pre-save middleware to set masterType
CitySchema.pre('save', function(next) {
  if (this.isNew) {
    this.masterType = MasterType.CITY;
  }
  next();
});

// Virtual for full location name
CitySchema.virtual('fullName').get(function() {
  return `${this.name}, ${this.state}, ${this.country}`;
});

// Virtual for location coordinates in GeoJSON format
CitySchema.virtual('geoLocation').get(function() {
  if (this.coordinates && this.coordinates.length === 2) {
    return {
      type: 'Point',
      coordinates: this.coordinates
    };
  }
  return null;
});

// Ensure virtuals are included in JSON output
CitySchema.set('toJSON', { virtuals: true });
CitySchema.set('toObject', { virtuals: true });
