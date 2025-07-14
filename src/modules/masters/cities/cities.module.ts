import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CitiesController } from './cities.controller';
import { CitiesService } from './cities.service';
import { City, CitySchema } from './schemas/city.schema';

/**
 * Cities Module
 * Handles city master data management
 */
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: City.name, schema: CitySchema }
    ])
  ],
  controllers: [CitiesController],
  providers: [CitiesService],
  exports: [CitiesService]
})
export class CitiesModule {}
