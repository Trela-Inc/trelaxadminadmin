import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { MasterFieldType, MasterStatus } from '../enums/master-type.enum';

/**
 * Master Field document type for TypeScript
 */
export type MasterFieldDocument = MasterField & Document;

/**
 * Master Field schema for MongoDB
 * Simple schema to manage all form dropdown fields
 */
@Schema({
  timestamps: true,
  collection: 'master_fields',
})
export class MasterField {
  @Prop({
    required: true,
    type: String,
    enum: MasterFieldType,
    index: true,
  })
  fieldType: MasterFieldType;

  @Prop({
    required: true,
    trim: true,
    index: true,
  })
  name: string;

  @Prop({
    required: false,
    trim: true,
  })
  description?: string;

  @Prop({
    required: false,
    trim: true,
  })
  value?: string; // For numeric fields like bedroom count

  @Prop({
    type: String,
    enum: MasterStatus,
    default: MasterStatus.ACTIVE,
    index: true,
  })
  status: MasterStatus;

  @Prop({
    default: 0,
  })
  sortOrder: number; // For custom sorting in dropdowns

  @Prop({
    default: false,
  })
  isDefault: boolean; // Mark default selections

  // For hierarchical data (e.g., locations under cities)
  @Prop({
    type: Types.ObjectId,
    ref: 'MasterField',
    required: false,
    index: true,
  })
  parentId?: Types.ObjectId;

  // System fields
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  createdBy: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: false,
  })
  updatedBy?: Types.ObjectId;

  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Create and export the MasterField schema
 */
export const MasterFieldSchema = SchemaFactory.createForClass(MasterField);

// Add compound indexes for better query performance
MasterFieldSchema.index({ fieldType: 1, name: 1 }, { unique: true });
MasterFieldSchema.index({ fieldType: 1, status: 1 });
MasterFieldSchema.index({ fieldType: 1, sortOrder: 1 });
MasterFieldSchema.index({ parentId: 1 });

// Text index for search
MasterFieldSchema.index({ 
  name: 'text', 
  description: 'text'
});

// Pre-save middleware
MasterFieldSchema.pre('save', function(next) {
  // Convert name to title case for consistency
  if (this.isModified('name')) {
    this.name = this.name.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }
  next();
});
