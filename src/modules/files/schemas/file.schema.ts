import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

/**
 * File document type for TypeScript
 */
export type FileDocument = File & Document;

/**
 * File schema for MongoDB
 * Stores metadata about uploaded files
 */
@Schema({
  timestamps: true, // Automatically add createdAt and updatedAt fields
  collection: 'files', // Specify collection name
})
export class File {
  @Prop({
    required: true,
    trim: true,
  })
  filename: string;

  @Prop({
    required: true,
    trim: true,
  })
  originalName: string;

  @Prop({
    required: true,
    trim: true,
  })
  mimetype: string;

  @Prop({
    required: true,
    min: 0,
  })
  size: number;

  @Prop({
    required: true,
    trim: true,
  })
  url: string;

  @Prop({
    required: true,
    trim: true,
    unique: true, // S3 key should be unique
  })
  key: string;

  @Prop({
    required: true,
    trim: true,
  })
  bucket: string;

  @Prop({
    required: false,
    trim: true,
    maxlength: 500,
  })
  description?: string;

  @Prop({
    required: false,
    type: [String],
    default: [],
  })
  tags?: string[];

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true, // Create index for user-based queries
  })
  uploadedBy: Types.ObjectId;

  @Prop({
    default: true,
    index: true, // Create index for active file queries
  })
  isActive: boolean;

  @Prop({
    default: false,
  })
  isPublic: boolean;

  @Prop({
    required: false,
  })
  expiresAt?: Date;

  @Prop({
    default: 0,
  })
  downloadCount: number;

  @Prop({
    required: false,
  })
  lastAccessedAt?: Date;

  // File category for organization
  @Prop({
    required: false,
    trim: true,
    enum: ['image', 'document', 'video', 'audio', 'archive', 'other'],
    default: 'other',
    index: true,
  })
  category?: string;

  // Timestamps (automatically added by Mongoose)
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Create and export the File schema
 */
export const FileSchema = SchemaFactory.createForClass(File);

// Add indexes for better query performance
FileSchema.index({ uploadedBy: 1 });
FileSchema.index({ isActive: 1 });
FileSchema.index({ category: 1 });
FileSchema.index({ createdAt: -1 });
FileSchema.index({ key: 1 }, { unique: true });

// Pre-save middleware to set category based on mimetype
FileSchema.pre('save', function(next) {
  if (this.isModified('mimetype')) {
    const mimetype = this.mimetype.toLowerCase();
    
    if (mimetype.startsWith('image/')) {
      this.category = 'image';
    } else if (mimetype.startsWith('video/')) {
      this.category = 'video';
    } else if (mimetype.startsWith('audio/')) {
      this.category = 'audio';
    } else if (mimetype.includes('pdf') || mimetype.includes('document') || mimetype.includes('text')) {
      this.category = 'document';
    } else if (mimetype.includes('zip') || mimetype.includes('rar') || mimetype.includes('tar')) {
      this.category = 'archive';
    } else {
      this.category = 'other';
    }
  }
  next();
});
