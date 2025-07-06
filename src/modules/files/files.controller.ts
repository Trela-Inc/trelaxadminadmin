import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Res,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiConsumes,
} from '@nestjs/swagger';
import { Response } from 'express';
import { FilesService } from './files.service';
import { UploadFileDto } from './dto/upload-file.dto';
import { QueryFileDto } from './dto/query-file.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ResponseUtil } from '../../common/utils/response.util';
import {
  ApiSuccessResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from '../../common/decorators/api-response.decorator';

/**
 * Files controller
 * Handles HTTP requests for file management operations
 */
@ApiTags('📁 Files')
@Controller('files')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  /**
   * Upload single file
   */
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload Single File',
    description: 'Upload a single file to S3 and save metadata',
  })
  @ApiCreatedResponse({
    description: 'File uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'File uploaded successfully' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            filename: { type: 'string' },
            originalName: { type: 'string' },
            mimetype: { type: 'string' },
            size: { type: 'number' },
            url: { type: 'string' },
            key: { type: 'string' },
            category: { type: 'string' },
            isPublic: { type: 'boolean' },
            createdAt: { type: 'string' },
          },
        },
        timestamp: { type: 'string' },
      },
    },
  })
  @ApiBadRequestResponse('Invalid file or upload failed')
  @ApiUnauthorizedResponse('Invalid or missing JWT token')
  async uploadFile(
    @UploadedFile() file: any,
    @Body() uploadFileDto: UploadFileDto,
    @Request() req
  ) {
    const uploadedFile = await this.filesService.uploadFile(
      file,
      uploadFileDto,
      req.user._id,
      'uploads'
    );
    return ResponseUtil.created(uploadedFile, 'File uploaded successfully');
  }

  /**
   * Upload multiple files
   */
  @Post('upload/multiple')
  @UseInterceptors(FilesInterceptor('files', 10))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload Multiple Files',
    description: 'Upload multiple files to S3 and save metadata',
  })
  @ApiCreatedResponse({
    description: 'Files uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Files uploaded successfully' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              filename: { type: 'string' },
              originalName: { type: 'string' },
              mimetype: { type: 'string' },
              size: { type: 'number' },
              url: { type: 'string' },
              key: { type: 'string' },
              category: { type: 'string' },
              isPublic: { type: 'boolean' },
              createdAt: { type: 'string' },
            },
          },
        },
        timestamp: { type: 'string' },
      },
    },
  })
  @ApiBadRequestResponse('Invalid files or upload failed')
  @ApiUnauthorizedResponse('Invalid or missing JWT token')
  async uploadMultipleFiles(
    @UploadedFiles() files: any[],
    @Body() uploadFileDto: UploadFileDto,
    @Request() req
  ) {
    const uploadedFiles = await this.filesService.uploadMultipleFiles(
      files,
      uploadFileDto,
      req.user._id,
      'uploads'
    );
    return ResponseUtil.created(uploadedFiles, 'Files uploaded successfully');
  }

  /**
   * Get all files with pagination and filtering
   */
  @Get()
  @ApiOperation({
    summary: 'Get All Files',
    description: 'Retrieve all files with pagination and filtering options',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search term' })
  @ApiQuery({ name: 'category', required: false, type: String, description: 'Filter by category' })
  @ApiSuccessResponse({
    description: 'Files retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Files retrieved successfully' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              filename: { type: 'string' },
              originalName: { type: 'string' },
              mimetype: { type: 'string' },
              size: { type: 'number' },
              url: { type: 'string' },
              category: { type: 'string' },
              isPublic: { type: 'boolean' },
              downloadCount: { type: 'number' },
              createdAt: { type: 'string' },
            },
          },
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
            total: { type: 'number' },
            totalPages: { type: 'number' },
            hasNext: { type: 'boolean' },
            hasPrev: { type: 'boolean' },
          },
        },
        timestamp: { type: 'string' },
      },
    },
  })
  @ApiUnauthorizedResponse('Invalid or missing JWT token')
  async findAll(@Query() queryDto: QueryFileDto, @Request() req) {
    const result = await this.filesService.findAll(queryDto, req.user._id);
    return ResponseUtil.paginated(
      result.files,
      result.pagination.page,
      result.pagination.limit,
      result.pagination.total,
      'Files retrieved successfully'
    );
  }

  /**
   * Get file by ID
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Get File by ID',
    description: 'Retrieve a specific file by its ID',
  })
  @ApiParam({ name: 'id', description: 'File ID' })
  @ApiSuccessResponse({
    description: 'File retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'File retrieved successfully' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            filename: { type: 'string' },
            originalName: { type: 'string' },
            mimetype: { type: 'string' },
            size: { type: 'number' },
            url: { type: 'string' },
            key: { type: 'string' },
            category: { type: 'string' },
            description: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
            isPublic: { type: 'boolean' },
            downloadCount: { type: 'number' },
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' },
          },
        },
        timestamp: { type: 'string' },
      },
    },
  })
  @ApiNotFoundResponse('File not found')
  @ApiUnauthorizedResponse('Invalid or missing JWT token')
  async findOne(@Param('id') id: string, @Request() req) {
    const file = await this.filesService.findById(id, req.user._id);
    return ResponseUtil.success(file, 'File retrieved successfully');
  }

  /**
   * Download file
   */
  @Get(':id/download')
  @ApiOperation({
    summary: 'Download File',
    description: 'Get download URL for a file',
  })
  @ApiParam({ name: 'id', description: 'File ID' })
  @ApiSuccessResponse({
    description: 'Download URL generated successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Download URL generated successfully' },
        data: {
          type: 'object',
          properties: {
            downloadUrl: { type: 'string', example: 'https://s3.amazonaws.com/bucket/file.jpg?signature=...' },
            expiresIn: { type: 'number', example: 3600 },
          },
        },
        timestamp: { type: 'string' },
      },
    },
  })
  @ApiNotFoundResponse('File not found')
  @ApiUnauthorizedResponse('Invalid or missing JWT token')
  async downloadFile(@Param('id') id: string, @Request() req) {
    const downloadUrl = await this.filesService.getDownloadUrl(id, req.user._id);
    return ResponseUtil.success(
      { downloadUrl, expiresIn: 3600 },
      'Download URL generated successfully'
    );
  }

  /**
   * Delete file by ID
   */
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete File',
    description: 'Delete file from S3 and database',
  })
  @ApiParam({ name: 'id', description: 'File ID' })
  @ApiSuccessResponse({
    description: 'File deleted successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'File deleted successfully' },
        timestamp: { type: 'string' },
      },
    },
  })
  @ApiNotFoundResponse('File not found')
  @ApiUnauthorizedResponse('Invalid or missing JWT token')
  async remove(@Param('id') id: string, @Request() req) {
    await this.filesService.remove(id, req.user._id);
    return ResponseUtil.successMessage('File deleted successfully');
  }

  /**
   * Get file statistics
   */
  @Get('admin/statistics')
  @ApiOperation({
    summary: 'Get File Statistics',
    description: 'Get comprehensive file statistics',
  })
  @ApiSuccessResponse({
    description: 'Statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Statistics retrieved successfully' },
        data: {
          type: 'object',
          properties: {
            totalFiles: { type: 'number' },
            activeFiles: { type: 'number' },
            inactiveFiles: { type: 'number' },
            publicFiles: { type: 'number' },
            privateFiles: { type: 'number' },
            totalSize: { type: 'number' },
            categoryDistribution: { type: 'object' },
          },
        },
        timestamp: { type: 'string' },
      },
    },
  })
  @ApiUnauthorizedResponse('Invalid or missing JWT token')
  async getStatistics(@Request() req) {
    const stats = await this.filesService.getStatistics(req.user._id);
    return ResponseUtil.success(stats, 'Statistics retrieved successfully');
  }
}
