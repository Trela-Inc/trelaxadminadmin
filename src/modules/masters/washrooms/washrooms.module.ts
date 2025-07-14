import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WashroomsController } from './washrooms.controller';
import { WashroomsService } from './washrooms.service';
import { Washroom, WashroomSchema } from './schemas/washroom.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Washroom.name, schema: WashroomSchema }
    ])
  ],
  controllers: [WashroomsController],
  providers: [WashroomsService],
  exports: [WashroomsService]
})
export class WashroomsModule {}
