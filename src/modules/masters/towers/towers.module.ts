import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TowersController } from './towers.controller';
import { TowersService } from './towers.service';
import { Tower, TowerSchema } from './schemas/tower.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tower.name, schema: TowerSchema }
    ])
  ],
  controllers: [TowersController],
  providers: [TowersService],
  exports: [TowersService]
})
export class TowersModule {}
