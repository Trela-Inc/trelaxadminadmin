// Manual seeding test script that can work with existing database
// This script tests the seeding logic without the full NestJS application

const { MongoClient } = require('mongodb');

// Sample data for testing
const sampleCities = [
  { name: 'Mumbai', state: 'Maharashtra', coordinates: [72.8777, 19.0760] },
  { name: 'Delhi', state: 'Delhi', coordinates: [77.1025, 28.7041] },
  { name: 'Bangalore', state: 'Karnataka', coordinates: [77.5946, 12.9716] },
];

const sampleAmenities = [
  { name: 'Swimming Pool', category: 'SPORTS', importance: 5 },
  { name: '24/7 Security', category: 'SECURITY', importance: 5 },
  { name: 'Gymnasium', category: 'SPORTS', importance: 4 },
  { name: 'Elevator', category: 'CONVENIENCE', importance: 5 },
  { name: 'Parking', category: 'CONVENIENCE', importance: 5 },
];

const sampleBuilders = [
  'Lodha Group', 'Godrej Properties', 'DLF Limited', 'Oberoi Realty', 'Prestige Group'
];

function generateLocationCode(cityName, index) {
  const cityPrefix = cityName.substring(0, 3).toUpperCase();
  return `${cityPrefix}${(index + 100).toString()}`;
}

function generateLocationName(cityName, index) {
  const suffixes = ['Nagar', 'Colony', 'Park', 'Gardens', 'Heights'];
  const names = ['Sunrise', 'Green', 'Royal', 'Golden', 'Silver'];
  return `${names[index % names.length]} ${suffixes[index % suffixes.length]}`;
}

async function testManualSeeding() {
  console.log('🧪 Testing manual seeding logic...');
  
  // Use the same connection string as the main application
  const uri = process.env.MONGO_URI || 'mongodb+srv://sj317772:j760WxKnG896pfZl@cluster0.tuzymnw.mongodb.net/trelax_test_db?retryWrites=true&w=majority&appName=Cluster0';
  
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS: 45000,
  });

  try {
    console.log('🔗 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected successfully');
    
    const db = client.db();
    
    // Clear existing test data
    console.log('🧹 Clearing existing test data...');
    await db.collection('masters').deleteMany({ name: { $regex: /^(Mumbai|Delhi|Bangalore|Sunrise|Green|Royal|Golden|Silver)/ } });
    await db.collection('builders').deleteMany({ name: { $in: sampleBuilders } });
    console.log('✅ Cleared test data');

    // Seed cities
    console.log('🏙️ Seeding cities...');
    const cities = [];
    for (const cityData of sampleCities) {
      const city = {
        name: cityData.name,
        masterType: 'CITY',
        status: 'ACTIVE',
        state: cityData.state,
        country: 'India',
        coordinates: cityData.coordinates,
        isPopular: true,
        sortOrder: cities.length + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const result = await db.collection('masters').insertOne(city);
      cities.push({ ...city, _id: result.insertedId });
      console.log(`   ✅ Inserted city: ${city.name}`);
    }

    // Seed locations
    console.log('📍 Seeding locations...');
    const locations = [];
    for (const city of cities) {
      for (let i = 0; i < 3; i++) {
        const location = {
          name: generateLocationName(city.name, i),
          masterType: 'LOCATION',
          status: 'ACTIVE',
          parentId: city._id,
          parentType: 'CITY',
          locationCode: generateLocationCode(city.name, i),
          coordinates: [
            city.coordinates[0] + (Math.random() - 0.5) * 0.1,
            city.coordinates[1] + (Math.random() - 0.5) * 0.1
          ],
          isPopular: i === 0,
          sortOrder: i + 1,
          locationType: ['residential', 'commercial', 'mixed'][i % 3],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        try {
          const result = await db.collection('masters').insertOne(location);
          locations.push({ ...location, _id: result.insertedId });
          console.log(`   ✅ Inserted location: ${location.name} (${location.locationCode})`);
        } catch (error) {
          if (error.code === 11000) {
            console.log(`   ⚠️  Duplicate location code ${location.locationCode}, skipping...`);
          } else {
            console.error(`   ❌ Error inserting location: ${error.message}`);
          }
        }
      }
    }

    // Seed amenities
    console.log('🏊 Seeding amenities...');
    const amenities = [];
    for (const amenityData of sampleAmenities) {
      const amenity = {
        name: amenityData.name,
        masterType: 'AMENITY',
        status: 'ACTIVE',
        category: amenityData.category,
        importanceLevel: amenityData.importance,
        isPopular: amenityData.importance >= 4,
        sortOrder: amenities.length + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const result = await db.collection('masters').insertOne(amenity);
      amenities.push({ ...amenity, _id: result.insertedId });
      console.log(`   ✅ Inserted amenity: ${amenity.name}`);
    }

    // Seed builders
    console.log('🏗️ Seeding builders...');
    const builders = [];
    for (const builderName of sampleBuilders) {
      const builder = {
        name: builderName,
        description: `${builderName} is a leading real estate developer.`,
        website: `https://www.${builderName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')}.com`,
        contactEmail: `info@${builderName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')}.com`,
        contactPhone: `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const result = await db.collection('builders').insertOne(builder);
      builders.push({ ...builder, _id: result.insertedId });
      console.log(`   ✅ Inserted builder: ${builder.name}`);
    }

    // Seed a sample project
    console.log('🏢 Seeding sample project...');
    const sampleProject = {
      projectName: 'Royal Heights Phase 1',
      projectDescription: 'A premium residential project with world-class amenities.',
      builder: {
        name: builders[0].name,
        description: builders[0].description,
        website: builders[0].website,
        contactEmail: builders[0].contactEmail,
        contactPhone: builders[0].contactPhone,
      },
      projectStatus: 'UNDER_CONSTRUCTION',
      location: {
        address: '123 Sample Street',
        cityId: cities[0]._id,
        locationId: locations[0]._id,
        state: cities[0].state,
        country: cities[0].country,
        pincode: '400001',
        landmark: 'Near Metro Station',
        coordinates: locations[0].coordinates,
      },
      reraNumber: 'RERA123456789',
      propertyType: 'RESIDENTIAL',
      totalUnits: 200,
      totalFloors: 25,
      totalTowers: 2,
      priceMin: 5000000,
      priceMax: 15000000,
      amenities: {
        amenityIds: amenities.slice(0, 3).map(a => a._id),
      },
      isActive: true,
      isFeatured: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const projectResult = await db.collection('projects').insertOne(sampleProject);
    console.log(`   ✅ Inserted project: ${sampleProject.projectName}`);

    // Verify the data
    console.log('\n📊 Verification:');
    const cityCount = await db.collection('masters').countDocuments({ masterType: 'CITY' });
    const locationCount = await db.collection('masters').countDocuments({ masterType: 'LOCATION' });
    const amenityCount = await db.collection('masters').countDocuments({ masterType: 'AMENITY' });
    const builderCount = await db.collection('builders').countDocuments({});
    const projectCount = await db.collection('projects').countDocuments({});

    console.log(`   Cities: ${cityCount}`);
    console.log(`   Locations: ${locationCount}`);
    console.log(`   Amenities: ${amenityCount}`);
    console.log(`   Builders: ${builderCount}`);
    console.log(`   Projects: ${projectCount}`);

    console.log('\n🎉 Manual seeding test completed successfully!');
    console.log('💡 The seeding logic works correctly. You can now run the full seeder.');

  } catch (error) {
    console.error('❌ Manual seeding test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your MongoDB connection string');
    console.log('2. Ensure your database allows connections from your IP');
    console.log('3. Verify your database credentials');
  } finally {
    await client.close();
  }
}

// Run the test
testManualSeeding();
