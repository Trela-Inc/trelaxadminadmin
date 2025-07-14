import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FloorsController } from './floors.controller';
import { FloorsService } from './floors.service';
import { Floor, FloorSchema } from './schemas/floor.schema';

/**
 * Floors Module
 * Handles floor master data management
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Floor.name, schema: FloorSchema }
    ])
  ],
  controllers: [FloorsController],
  providers: [FloorsService],
  exports: [FloorsService]
})
export class FloorsModule {}
