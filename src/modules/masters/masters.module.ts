import { Module } from '@nestjs/common';
import { CitiesModule } from './cities/cities.module';
import { LocationsModule } from './locations/locations.module';
import { AmenitiesModule } from './amenities/amenities.module';
import { FloorsModule } from './floors/floors.module';
import { TowersModule } from './towers/towers.module';
import { PropertyTypesModule } from './property-types/property-types.module';
import { RoomsModule } from './rooms/rooms.module';
import { WashroomsModule } from './washrooms/washrooms.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    CitiesModule,
    LocationsModule,
    AmenitiesModule,
    FloorsModule,
    TowersModule,
    PropertyTypesModule,
    RoomsModule,
    WashroomsModule,
    UploadsModule,
  ],
  exports: [
    CitiesModule,
    LocationsModule,
    AmenitiesModule,
    FloorsModule,
    TowersModule,
    PropertyTypesModule,
    RoomsModule,
    WashroomsModule,
    UploadsModule,
  ],
})
export class MastersModule {}