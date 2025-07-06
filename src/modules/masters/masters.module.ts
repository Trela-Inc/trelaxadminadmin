import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MastersController } from './masters.controller';
import { MastersService } from './masters.service';

// Schema
import { MasterField, MasterFieldSchema } from './schemas/master-field.schema';

/**
 * Masters module
 * Handles master field management for form dropdowns
 * Provides centralized control over configurable fields used in projects, builders, agents, etc.
 */
@Module({
  imports: [
    // Register master field schema with Mongoose
    MongooseModule.forFeature([
      { name: MasterField.name, schema: MasterFieldSchema },
    ]),
  ],
  controllers: [MastersController],
  providers: [MastersService],
  exports: [MastersService], // Export service for use in other modules (like ProjectsModule)
})
export class MastersModule {}
