import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { 
  ProjectStatus, 
  PropertyType, 
  UnitType, 
  FacingDirection, 
  PossessionStatus,
  ApprovalStatus 
} from '../enums/project-status.enum';

/**
 * Project document type for TypeScript
 */
export type ProjectDocument = Project & Document;

/**
 * Location sub-schema
 */
@Schema({ _id: false })
export class Location {
  @Prop({ required: true, trim: true })
  address: string;

  @Prop({ required: true, trim: true })
  city: string;

  @Prop({ required: true, trim: true })
  state: string;

  @Prop({ required: true, trim: true })
  country: string;

  @Prop({ required: true, trim: true })
  pincode: string;

  @Prop({ required: false, trim: true })
  landmark?: string;

  @Prop({ required: false, type: [Number], validate: [arrayLimit, 'Coordinates must have exactly 2 elements'] })
  coordinates?: [number, number]; // [longitude, latitude]
}

/**
 * Builder sub-schema
 */
@Schema({ _id: false })
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
  logo?: string; // S3 URL
}

/**
 * Unit Configuration sub-schema
 */
@Schema({ _id: false })
export class UnitConfiguration {
  @Prop({ required: true, enum: UnitType, type: String })
  type: UnitType;

  @Prop({ required: true, trim: true })
  name: string; // e.g., "2 BHK", "3 BHK", "Studio"

  @Prop({ required: true, min: 0 })
  bedrooms: number;

  @Prop({ required: true, min: 0 })
  bathrooms: number;

  @Prop({ required: false, min: 0 })
  balconies?: number;

  @Prop({ required: true, min: 0 })
  carpetArea: number; // in sq ft

  @Prop({ required: false, min: 0 })
  builtUpArea?: number; // in sq ft

  @Prop({ required: false, min: 0 })
  superBuiltUpArea?: number; // in sq ft

  @Prop({ required: true, min: 0 })
  priceMin: number;

  @Prop({ required: true, min: 0 })
  priceMax: number;

  @Prop({ required: false, min: 0 })
  totalUnits?: number;

  @Prop({ required: false, min: 0 })
  availableUnits?: number;

  @Prop({ required: false, type: [String], enum: FacingDirection })
  facing?: FacingDirection[];

  @Prop({ required: false, type: [String] })
  floorPlans?: string[]; // S3 URLs for floor plan images
}

/**
 * Amenities sub-schema
 */
@Schema({ _id: false })
export class Amenities {
  @Prop({ required: false, type: [String], default: [] })
  basic?: string[]; // Swimming Pool, Gym, etc.

  @Prop({ required: false, type: [String], default: [] })
  security?: string[]; // CCTV, Security Guard, etc.

  @Prop({ required: false, type: [String], default: [] })
  recreational?: string[]; // Club House, Garden, etc.

  @Prop({ required: false, type: [String], default: [] })
  convenience?: string[]; // Parking, Lift, etc.

  @Prop({ required: false, type: [String], default: [] })
  connectivity?: string[]; // Metro, Bus Stop, etc.
}

/**
 * Media sub-schema
 */
@Schema({ _id: false })
export class Media {
  @Prop({ required: false, type: [String], default: [] })
  images?: string[]; // S3 URLs

  @Prop({ required: false, type: [String], default: [] })
  videos?: string[]; // S3 URLs

  @Prop({ required: false, type: [String], default: [] })
  brochures?: string[]; // S3 URLs

  @Prop({ required: false, type: [String], default: [] })
  floorPlans?: string[]; // S3 URLs

  @Prop({ required: false, type: [String], default: [] })
  masterPlan?: string[]; // S3 URLs

  @Prop({ required: false, type: [String], default: [] })
  locationMap?: string[]; // S3 URLs
}

/**
 * Documents sub-schema
 */
@Schema({ _id: false })
export class Documents {
  @Prop({ required: false, type: [String], default: [] })
  approvals?: string[]; // S3 URLs for approval documents

  @Prop({ required: false, type: [String], default: [] })
  legalDocuments?: string[]; // S3 URLs

  @Prop({ required: false, type: [String], default: [] })
  certificates?: string[]; // S3 URLs

  @Prop({ required: false, type: [String], default: [] })
  others?: string[]; // S3 URLs
}

/**
 * Project schema for MongoDB
 */
@Schema({
  timestamps: true,
  collection: 'projects',
})
export class Project {
  // Basic Details
  @Prop({ required: true, trim: true, index: true })
  projectName: string;

  @Prop({ required: true, trim: true })
  projectDescription: string;

  @Prop({ required: true, type: Builder })
  builder: Builder;

  @Prop({
    required: true,
    type: String,
    enum: ProjectStatus,
    index: true
  })
  projectStatus: ProjectStatus;

  @Prop({ required: true, type: Location })
  location: Location;

  @Prop({ required: false, trim: true })
  reraNumber?: string;

  // Property Details
  @Prop({
    required: true,
    type: String,
    enum: PropertyType,
    index: true
  })
  propertyType: PropertyType;

  @Prop({ required: true, type: [UnitConfiguration] })
  unitConfigurations: UnitConfiguration[];

  @Prop({
    required: false,
    type: String,
    enum: PossessionStatus
  })
  possessionStatus?: PossessionStatus;

  @Prop({ required: false })
  possessionDate?: Date;

  @Prop({ required: false, min: 0 })
  totalArea?: number; // in acres or sq ft

  @Prop({ required: false, min: 0 })
  totalUnits?: number;

  @Prop({ required: false, min: 0 })
  totalFloors?: number;

  @Prop({ required: false, min: 0 })
  totalTowers?: number;

  // Pricing
  @Prop({ required: false, min: 0 })
  priceMin?: number;

  @Prop({ required: false, min: 0 })
  priceMax?: number;

  @Prop({ required: false, min: 0 })
  pricePerSqFt?: number;

  // Amenities
  @Prop({ required: false, type: Amenities })
  amenities?: Amenities;

  // Media & Documents
  @Prop({ required: false, type: Media })
  media?: Media;

  @Prop({ required: false, type: Documents })
  documents?: Documents;

  // Additional Information
  @Prop({ required: false, type: [String], default: [] })
  tags?: string[];

  @Prop({ required: false, trim: true })
  highlights?: string;

  @Prop({
    required: false,
    type: String,
    enum: ApprovalStatus,
    default: ApprovalStatus.PENDING
  })
  approvalStatus?: ApprovalStatus;

  @Prop({ required: false, type: [String], default: [] })
  nearbyFacilities?: string[];

  // System Fields
  @Prop({ default: true, index: true })
  isActive: boolean;

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop({ default: 0 })
  viewCount: number;

  @Prop({ default: 0 })
  inquiryCount: number;

  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
}

// Validation function for coordinates array
function arrayLimit(val: number[]) {
  return val.length === 2;
}

/**
 * Create and export the Project schema
 */
export const ProjectSchema = SchemaFactory.createForClass(Project);
export const LocationSchema = SchemaFactory.createForClass(Location);
export const BuilderSchema = SchemaFactory.createForClass(Builder);
export const UnitConfigurationSchema = SchemaFactory.createForClass(UnitConfiguration);
export const AmenitiesSchema = SchemaFactory.createForClass(Amenities);
export const MediaSchema = SchemaFactory.createForClass(Media);
export const DocumentsSchema = SchemaFactory.createForClass(Documents);

// Add indexes for better query performance
ProjectSchema.index({ projectName: 'text', projectDescription: 'text' });
ProjectSchema.index({ 'location.city': 1 });
ProjectSchema.index({ 'location.state': 1 });
ProjectSchema.index({ propertyType: 1 });
ProjectSchema.index({ projectStatus: 1 });
ProjectSchema.index({ createdAt: -1 });
ProjectSchema.index({ 'location.coordinates': '2dsphere' }); // For geospatial queries
