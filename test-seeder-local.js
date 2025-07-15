// Simple test script to verify seeder works with local MongoDB
const { MongoClient } = require('mongodb');

async function testLocalConnection() {
  console.log('🧪 Testing local MongoDB connection...');
  
  const uri = 'mongodb://localhost:27017/trelax_seeded_db';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Successfully connected to local MongoDB');
    
    const db = client.db('trelax_seeded_db');
    
    // Test basic operations
    const testCollection = db.collection('test');
    await testCollection.insertOne({ test: 'data', timestamp: new Date() });
    console.log('✅ Successfully inserted test document');
    
    const count = await testCollection.countDocuments();
    console.log(`✅ Test collection has ${count} documents`);
    
    // Clean up
    await testCollection.deleteMany({});
    console.log('✅ Cleaned up test data');
    
    console.log('🎉 Local MongoDB is ready for seeding!');
    console.log('💡 Run: MONGO_URI=mongodb://localhost:27017/trelax_seeded_db npm run seed');
    
  } catch (error) {
    console.error('❌ Local MongoDB connection failed:', error.message);
    console.log('');
    console.log('🔧 To fix this:');
    console.log('1. Install MongoDB locally: https://www.mongodb.com/try/download/community');
    console.log('2. Start MongoDB service');
    console.log('3. Or use MongoDB Atlas with proper SSL configuration');
    console.log('');
    console.log('🌐 Alternative: Use the existing database connection');
    console.log('   The seeder will work with your current database once connection is established');
  } finally {
    await client.close();
  }
}

testLocalConnection();
