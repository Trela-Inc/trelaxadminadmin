import { Prop, Schema } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { MasterStatus, MasterType } from '../enums/master-types.enum';

/**
 * Base Master Schema
 * Common fields that all master data schemas should extend
 */
@Schema({ 
  timestamps: true,
  discriminatorKey: 'masterType',
  collection: 'masters'
})
export class BaseMaster {
  @Prop({
    required: true,
    trim: true,
    maxlength: 100
    // Removed index: true as it should be defined in schema.index()
  })
  name: string;

  @Prop({
    required: false,
    trim: true,
    maxlength: 500
  })
  description?: string;

  @Prop({
    required: false,
    trim: true,
    maxlength: 20,
    unique: true,
    sparse: true
    // Removed index: true as unique implies an index
  })
  code?: string;

  @Prop({
    required: true,
    type: String,
    enum: Object.values(MasterType)
    // Removed index: true as it should be defined in schema.index()
  })
  masterType: MasterType;

  @Prop({
    required: true,
    type: String,
    enum: Object.values(MasterStatus),
    default: MasterStatus.ACTIVE
    // Removed index: true as it should be defined in schema.index()
  })
  status: MasterStatus;

  @Prop({
    required: false,
    min: 0,
    max: 9999,
    default: 0
    // Removed index: true as it should be defined in schema.index()
  })
  sortOrder?: number;

  @Prop({
    required: false,
    default: false
    // Removed index: true as it should be defined in schema.index()
  })
  isDefault?: boolean;

  @Prop({
    required: false,
    default: false
    // Removed index: true as it should be defined in schema.index()
  })
  isPopular?: boolean;

  @Prop({ 
    required: false, 
    type: Object,
    default: {} 
  })
  metadata?: Record<string, any>;

  // Timestamps (automatically added by timestamps: true)
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Base Master Document type
 */
export type BaseMasterDocument = BaseMaster & Document;

/**
 * Master with Parent Schema
 * For hierarchical master data (like locations under cities)
 */
@Schema({ _id: false })
export class MasterWithParent extends BaseMaster {
  @Prop({
    required: false,
    type: Types.ObjectId,
    ref: 'BaseMaster'
    // Removed index: true as it should be defined in schema.index()
  })
  parentId?: Types.ObjectId;

  @Prop({
    required: false,
    type: String,
    enum: Object.values(MasterType)
  })
  parentType?: MasterType;
}

/**
 * Master with Category Schema
 * For categorized master data (like amenities)
 */
@Schema({ _id: false })
export class MasterWithCategory extends BaseMaster {
  @Prop({
    required: false,
    trim: true,
    maxlength: 50
    // Removed index: true as it should be defined in schema.index()
  })
  category?: string;

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
}

/**
 * Master with Numeric Value Schema
 * For master data with numeric values (like room counts, floor numbers)
 */
@Schema({ _id: false })
export class MasterWithNumericValue extends BaseMaster {
  @Prop({
    required: false
    // Removed index: true as it should be defined in schema.index()
  })
  numericValue?: number;

  @Prop({ 
    required: false, 
    trim: true, 
    maxlength: 20 
  })
  unit?: string;

  @Prop({ 
    required: false 
  })
  minValue?: number;

  @Prop({ 
    required: false 
  })
  maxValue?: number;
}

/**
 * Master with Location Schema
 * For geographical master data (like cities)
 */
@Schema({ _id: false })
export class MasterWithLocation extends BaseMaster {
  @Prop({
    required: false,
    trim: true,
    maxlength: 100
    // Removed index: true as it should be defined in schema.index()
  })
  state?: string;

  @Prop({
    required: false,
    trim: true,
    maxlength: 100
    // Removed index: true as it should be defined in schema.index()
  })
  country?: string;

  @Prop({
    required: false,
    type: [Number],
    validate: [arrayLimit, 'Coordinates must have exactly 2 elements']
    // Removed index: '2dsphere' as it should be defined in schema.index()
  })
  coordinates?: [number, number]; // [longitude, latitude]

  @Prop({ 
    required: false, 
    trim: true, 
    maxlength: 50 
  })
  timezone?: string;

  @Prop({ 
    required: false, 
    type: [String],
    default: [] 
  })
  pinCodes?: string[];
}

// Validation function for coordinates array
function arrayLimit(val: number[]) {
  return val.length === 2;
}

/**
 * Combined Master Schema
 * Combines all possible fields for flexibility
 */
@Schema({ 
  timestamps: true,
  discriminatorKey: 'masterType',
  collection: 'masters'
})
export class CombinedMaster extends BaseMaster {
  // Parent relationship fields
  @Prop({
    required: false,
    type: Types.ObjectId,
    ref: 'CombinedMaster'
    // Removed index: true as it should be defined in schema.index()
  })
  parentId?: Types.ObjectId;

  @Prop({
    required: false,
    type: String,
    enum: Object.values(MasterType)
  })
  parentType?: MasterType;

  // Category fields
  @Prop({
    required: false,
    trim: true,
    maxlength: 50
    // Removed index: true as it should be defined in schema.index()
  })
  category?: string;

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

  // Numeric value fields
  @Prop({
    required: false
    // Removed index: true as it should be defined in schema.index()
  })
  numericValue?: number;

  @Prop({ 
    required: false, 
    trim: true, 
    maxlength: 20 
  })
  unit?: string;

  @Prop({ 
    required: false 
  })
  minValue?: number;

  @Prop({ 
    required: false 
  })
  maxValue?: number;

  // Location fields
  @Prop({
    required: false,
    trim: true,
    maxlength: 100
    // Removed index: true as it should be defined in schema.index()
  })
  state?: string;

  @Prop({
    required: false,
    trim: true,
    maxlength: 100
    // Removed index: true as it should be defined in schema.index()
  })
  country?: string;

  @Prop({
    required: false,
    type: [Number],
    validate: [arrayLimit, 'Coordinates must have exactly 2 elements']
    // Removed index: '2dsphere' as it should be defined in schema.index()
  })
  coordinates?: [number, number];

  @Prop({ 
    required: false, 
    trim: true, 
    maxlength: 50 
  })
  timezone?: string;

  @Prop({ 
    required: false, 
    type: [String],
    default: [] 
  })
  pinCodes?: string[];
}

export type CombinedMasterDocument = CombinedMaster & Document;
