import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { File, FileDocument } from './schemas/file.schema';
import { UploadFileDto } from './dto/upload-file.dto';
import { QueryFileDto } from './dto/query-file.dto';
import { S3Service } from './services/s3.service';

/**
 * Files service
 * Handles all file-related business logic and database operations
 */
@Injectable()
export class FilesService {
  constructor(
    @InjectModel(File.name) private fileModel: Model<FileDocument>,
    private readonly s3Service: S3Service,
  ) {}

  /**
   * Upload file to S3 and save metadata to database
   */
  async uploadFile(
    file: any,
    uploadFileDto: UploadFileDto,
    userId: string,
    folder: string = 'uploads'
  ): Promise<File> {
    try {
      // Upload file to S3
      const s3Result = await this.s3Service.uploadFile(
        file,
        folder,
        uploadFileDto.isPublic || false
      );

      // Save file metadata to database
      const fileDocument = new this.fileModel({
        filename: s3Result.key.split('/').pop(),
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        url: s3Result.url,
        key: s3Result.key,
        bucket: s3Result.bucket,
        description: uploadFileDto.description,
        tags: uploadFileDto.tags || [],
        uploadedBy: new Types.ObjectId(userId),
        isPublic: uploadFileDto.isPublic || false,
      });

      return await fileDocument.save();
    } catch (error) {
      throw new BadRequestException('Failed to upload file');
    }
  }

  /**
   * Upload multiple files
   */
  async uploadMultipleFiles(
    files: any[],
    uploadFileDto: UploadFileDto,
    userId: string,
    folder: string = 'uploads'
  ): Promise<File[]> {
    const uploadPromises = files.map(file =>
      this.uploadFile(file, uploadFileDto, userId, folder)
    );

    return await Promise.all(uploadPromises);
  }

  /**
   * Find all files with pagination and filtering
   */
  async findAll(queryDto: QueryFileDto, userId?: string) {
    const {
      page,
      limit,
      search,
      category,
      isActive,
      isPublic,
      uploadedBy,
      sortBy,
      sortOrder,
    } = queryDto;

    // Build filter object
    const filter: any = {};

    if (search) {
      filter.$or = [
        { filename: { $regex: search, $options: 'i' } },
        { originalName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (typeof isActive === 'boolean') {
      filter.isActive = isActive;
    }

    if (typeof isPublic === 'boolean') {
      filter.isPublic = isPublic;
    }

    if (uploadedBy) {
      filter.uploadedBy = new Types.ObjectId(uploadedBy);
    }

    // If not admin, only show user's own files and public files
    if (userId && !uploadedBy) {
      filter.$or = [
        { uploadedBy: new Types.ObjectId(userId) },
        { isPublic: true },
      ];
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute queries
    const [files, total] = await Promise.all([
      this.fileModel
        .find(filter)
        .populate('uploadedBy', 'firstName lastName email')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.fileModel.countDocuments(filter),
    ]);

    return {
      files,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  /**
   * Find file by ID
   */
  async findById(id: string, userId?: string): Promise<File> {
    try {
      const file = await this.fileModel
        .findById(id)
        .populate('uploadedBy', 'firstName lastName email')
        .exec();

      if (!file) {
        throw new NotFoundException('File not found');
      }

      // Check if user has access to this file
      if (!file.isPublic && userId && file.uploadedBy.toString() !== userId) {
        throw new NotFoundException('File not found');
      }

      // Update last accessed time and increment download count
      await this.fileModel.findByIdAndUpdate(id, {
        lastAccessedAt: new Date(),
        $inc: { downloadCount: 1 },
      });

      return file;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Invalid file ID');
    }
  }

  /**
   * Generate download URL for file
   */
  async getDownloadUrl(id: string, userId?: string): Promise<string> {
    const file = await this.findById(id, userId);
    return await this.s3Service.getPresignedUrl(file.key);
  }

  /**
   * Delete file by ID
   */
  async remove(id: string, userId: string): Promise<void> {
    try {
      const file = await this.fileModel.findById(id);

      if (!file) {
        throw new NotFoundException('File not found');
      }

      // Check if user owns this file
      if (file.uploadedBy.toString() !== userId) {
        throw new BadRequestException('You can only delete your own files');
      }

      // Delete from S3
      await this.s3Service.deleteFile(file.key);

      // Delete from database
      await this.fileModel.findByIdAndDelete(id);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete file');
    }
  }

  /**
   * Get file statistics
   */
  async getStatistics(userId?: string) {
    const filter = userId ? { uploadedBy: new Types.ObjectId(userId) } : {};

    const [
      totalFiles,
      activeFiles,
      inactiveFiles,
      publicFiles,
      privateFiles,
      categoryStats,
      totalSize,
    ] = await Promise.all([
      this.fileModel.countDocuments(filter),
      this.fileModel.countDocuments({ ...filter, isActive: true }),
      this.fileModel.countDocuments({ ...filter, isActive: false }),
      this.fileModel.countDocuments({ ...filter, isPublic: true }),
      this.fileModel.countDocuments({ ...filter, isPublic: false }),
      this.fileModel.aggregate([
        { $match: filter },
        { $group: { _id: '$category', count: { $sum: 1 } } },
      ]),
      this.fileModel.aggregate([
        { $match: filter },
        { $group: { _id: null, totalSize: { $sum: '$size' } } },
      ]),
    ]);

    return {
      totalFiles,
      activeFiles,
      inactiveFiles,
      publicFiles,
      privateFiles,
      totalSize: totalSize[0]?.totalSize || 0,
      categoryDistribution: categoryStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
    };
  }

  /**
   * Get files by category
   */
  async getFilesByCategory(category: string, limit: number = 20): Promise<File[]> {
    return await this.fileModel
      .find({ category, isActive: true, isPublic: true })
      .populate('uploadedBy', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  /**
   * Search files by tags
   */
  async searchByTags(tags: string[], limit: number = 20): Promise<File[]> {
    return await this.fileModel
      .find({ tags: { $in: tags }, isActive: true, isPublic: true })
      .populate('uploadedBy', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }
}
