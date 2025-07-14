import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Builder, BuilderSchema } from './schemas/builder.schema';
import { BuildersService } from './builders.service';
import { BuildersController } from './builders.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Builder.name, schema: BuilderSchema }])],
  controllers: [BuildersController],
  providers: [BuildersService],
  exports: [BuildersService],
})
export class BuildersModule {} 