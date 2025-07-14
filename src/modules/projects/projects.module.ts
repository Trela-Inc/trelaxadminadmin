import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { Project, ProjectSchema } from './schemas/project.schema';
import { S3Service } from '../files/services/s3.service';
import { City, CitySchema } from '../masters/cities/schemas/city.schema';
import { Location, LocationSchema } from '../masters/locations/schemas/location.schema';
import { Amenity, AmenitySchema } from '../masters/amenities/schemas/amenity.schema';

/**
 * Projects module
 * Handles real estate project management functionality including CRUD operations and file uploads
 */
@Module({
  imports: [
    // Register Project schema with Mongoose
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: City.name, schema: CitySchema },
      { name: Location.name, schema: LocationSchema },
      { name: Amenity.name, schema: AmenitySchema }
    ]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, S3Service],
  exports: [ProjectsService], // Export service for use in other modules
})
export class ProjectsModule {}
