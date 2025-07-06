import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

/**
 * AWS S3 service for file upload and management
 * Handles all S3 operations including upload, download, and delete
 */
@Injectable()
export class S3Service {
  private s3: AWS.S3;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    // Configure AWS S3
    AWS.config.update({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get<string>('AWS_REGION'),
    });

    this.s3 = new AWS.S3();
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET');

    if (!this.bucketName) {
      throw new Error('AWS_S3_BUCKET is not configured');
    }
  }

  /**
   * Upload file to S3
   */
  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'uploads',
    isPublic: boolean = false
  ): Promise<{
    key: string;
    url: string;
    bucket: string;
  }> {
    try {
      // Generate unique filename
      const fileExtension = file.originalname.split('.').pop();
      const fileName = `${uuidv4()}.${fileExtension}`;
      const key = `${folder}/${fileName}`;

      // Upload parameters
      const uploadParams: AWS.S3.PutObjectRequest = {
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentDisposition: 'inline',
        Metadata: {
          originalName: file.originalname,
          uploadedAt: new Date().toISOString(),
        },
      };

      // Set ACL based on public/private setting
      if (isPublic) {
        uploadParams.ACL = 'public-read';
      }

      // Upload to S3
      const result = await this.s3.upload(uploadParams).promise();

      return {
        key,
        url: result.Location,
        bucket: this.bucketName,
      };
    } catch (error) {
      console.error('S3 Upload Error:', error);
      throw new InternalServerErrorException('Failed to upload file to S3');
    }
  }

  /**
   * Generate presigned URL for file download
   */
  async getPresignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const params = {
        Bucket: this.bucketName,
        Key: key,
        Expires: expiresIn, // URL expires in seconds
      };

      return await this.s3.getSignedUrlPromise('getObject', params);
    } catch (error) {
      console.error('S3 Presigned URL Error:', error);
      throw new InternalServerErrorException('Failed to generate download URL');
    }
  }

  /**
   * Delete file from S3
   */
  async deleteFile(key: string): Promise<void> {
    try {
      const params = {
        Bucket: this.bucketName,
        Key: key,
      };

      await this.s3.deleteObject(params).promise();
    } catch (error) {
      console.error('S3 Delete Error:', error);
      throw new InternalServerErrorException('Failed to delete file from S3');
    }
  }

  /**
   * Check if file exists in S3
   */
  async fileExists(key: string): Promise<boolean> {
    try {
      const params = {
        Bucket: this.bucketName,
        Key: key,
      };

      await this.s3.headObject(params).promise();
      return true;
    } catch (error) {
      if (error.code === 'NotFound') {
        return false;
      }
      throw new InternalServerErrorException('Failed to check file existence');
    }
  }

  /**
   * Get file metadata from S3
   */
  async getFileMetadata(key: string): Promise<AWS.S3.HeadObjectOutput> {
    try {
      const params = {
        Bucket: this.bucketName,
        Key: key,
      };

      return await this.s3.headObject(params).promise();
    } catch (error) {
      console.error('S3 Metadata Error:', error);
      throw new InternalServerErrorException('Failed to get file metadata');
    }
  }

  /**
   * Copy file within S3
   */
  async copyFile(sourceKey: string, destinationKey: string): Promise<void> {
    try {
      const params = {
        Bucket: this.bucketName,
        CopySource: `${this.bucketName}/${sourceKey}`,
        Key: destinationKey,
      };

      await this.s3.copyObject(params).promise();
    } catch (error) {
      console.error('S3 Copy Error:', error);
      throw new InternalServerErrorException('Failed to copy file');
    }
  }

  /**
   * List files in S3 bucket with prefix
   */
  async listFiles(prefix: string = '', maxKeys: number = 1000): Promise<AWS.S3.Object[]> {
    try {
      const params = {
        Bucket: this.bucketName,
        Prefix: prefix,
        MaxKeys: maxKeys,
      };

      const result = await this.s3.listObjectsV2(params).promise();
      return result.Contents || [];
    } catch (error) {
      console.error('S3 List Error:', error);
      throw new InternalServerErrorException('Failed to list files');
    }
  }

  /**
   * Get S3 bucket name
   */
  getBucketName(): string {
    return this.bucketName;
  }
}
