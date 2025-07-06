import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { Project, ProjectSchema } from './schemas/project.schema';
import { S3Service } from '../files/services/s3.service';

/**
 * Projects module
 * Handles real estate project management functionality including CRUD operations and file uploads
 */
@Module({
  imports: [
    // Register Project schema with Mongoose
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema }
    ]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, S3Service],
  exports: [ProjectsService], // Export service for use in other modules
})
export class ProjectsModule {}
