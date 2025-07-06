import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { File, FileSchema } from './schemas/file.schema';
import { S3Service } from './services/s3.service';

/**
 * Files module
 * Handles file management functionality including upload, download, and S3 integration
 */
@Module({
  imports: [
    // Register File schema with Mongoose
    MongooseModule.forFeature([
      { name: File.name, schema: FileSchema }
    ]),
  ],
  controllers: [FilesController],
  providers: [FilesService, S3Service],
  exports: [FilesService, S3Service], // Export services for use in other modules
})
export class FilesModule {}
