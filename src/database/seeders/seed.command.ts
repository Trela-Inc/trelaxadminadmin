import { NestFactory } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ComprehensiveSeeder } from './comprehensive.seeder';

// Import all schemas
import { City, CitySchema } from '../../modules/masters/cities/schemas/city.schema';
import { Location, LocationSchema } from '../../modules/masters/locations/schemas/location.schema';
import { Amenity, AmenitySchema } from '../../modules/masters/amenities/schemas/amenity.schema';
import { Floor, FloorSchema } from '../../modules/masters/floors/schemas/floor.schema';
import { Tower, TowerSchema } from '../../modules/masters/towers/schemas/tower.schema';
import { PropertyType, PropertyTypeSchema } from '../../modules/masters/property-types/schemas/property-type.schema';
import { Room, RoomSchema } from '../../modules/masters/rooms/schemas/room.schema';
import { Washroom, WashroomSchema } from '../../modules/masters/washrooms/schemas/washroom.schema';
import { Project, ProjectSchema } from '../../modules/projects/schemas/project.schema';
import { Builder, BuilderSchema } from '../../modules/builders/schemas/builder.schema';
import { Agent, AgentSchema } from '../../modules/agents/schemas/agent.schema';

@Module({
  imports: [
    // Configuration module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        // Try local MongoDB first, then fallback to Atlas
        const uri = configService.get<string>('MONGO_URI') ||
                   process.env.MONGO_URI ||
                   'mongodb://localhost:27017/trelax_seeded_db';

        console.log('🔗 Attempting to connect to:', uri.includes('localhost') ? 'Local MongoDB' : 'MongoDB Atlas');

        return {
          uri,
          maxPoolSize: 10,
          serverSelectionTimeoutMS: 15000,
          socketTimeoutMS: 45000,
          bufferCommands: false,
        };
      },
      inject: [ConfigService],
    }),

    // Register all schemas
    MongooseModule.forFeature([
      { name: City.name, schema: CitySchema },
      { name: Location.name, schema: LocationSchema },
      { name: Amenity.name, schema: AmenitySchema },
      { name: Floor.name, schema: FloorSchema },
      { name: Tower.name, schema: TowerSchema },
      { name: PropertyType.name, schema: PropertyTypeSchema },
      { name: Room.name, schema: RoomSchema },
      { name: Washroom.name, schema: WashroomSchema },
      { name: Project.name, schema: ProjectSchema },
      { name: Builder.name, schema: BuilderSchema },
      { name: Agent.name, schema: AgentSchema },
    ]),
  ],
  providers: [ComprehensiveSeeder],
})
export class SeedModule {}

async function bootstrap() {
  console.log('🌱 Starting database seeding process...');

  const mongoUri = process.env.MONGO_URI || 'mongodb+srv://sj317772:j760WxKnG896pfZl@cluster0.tuzymnw.mongodb.net/trelax_seeded_db?retryWrites=true&w=majority&appName=Cluster0';
  console.log('📊 Database URI:', mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide credentials in log

  try {
    const app = await NestFactory.createApplicationContext(SeedModule);
    const seeder = app.get(ComprehensiveSeeder);

    console.log('🚀 Initializing seeder...');
    await seeder.seedAll();

    console.log('✅ Seeding completed successfully!');
    console.log('📈 Database has been populated with:');
    console.log('   - 20 Indian cities with coordinates');
    console.log('   - 200+ locations across cities');
    console.log('   - 30+ categorized amenities');
    console.log('   - Property configuration data (floors, towers, types, rooms, washrooms)');
    console.log('   - 25 real estate builders');
    console.log('   - 50 real estate agents');
    console.log('   - 100 realistic projects with complete details');
    console.log('');
    console.log('🎯 You can now:');
    console.log('   1. Start your application: npm run start:dev');
    console.log('   2. Access Swagger UI: http://localhost:3000/api/v1/docs');
    console.log('   3. Login with: admin@trelax.com / admin123');
    console.log('   4. Explore all the seeded data through the APIs');

    await app.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n⚠️  Seeding interrupted by user');
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('\n⚠️  Seeding terminated');
  process.exit(1);
});

bootstrap();
