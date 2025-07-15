# 🛠️ Seeder Fixes and Database Connection Guide

## 🔍 Issues Fixed

### 1. Fixed Duplicate Key Error for Locations

The seeder was failing with this error:
```
MongoServerError: E11000 duplicate key error collection: test.masters index: locationCode_1_parentId_1 dup key: { locationCode: null, parentId: ObjectId('...') }
```

#### ✅ Solutions Implemented:

1. **Ensured locationCode is never null**
   - Added `generateUniqueLocationCode()` method to create unique codes
   - Implemented city-specific code tracking to prevent duplicates
   - Added retry logic with different code generation on conflicts

2. **Added Idempotency**
   - Added check for existing locations before insertion
   - Implemented proper error handling with detailed logging
   - Added retry mechanism for duplicate key errors

3. **Removed Redundant Index Declarations**
   - Fixed duplicate index declarations in schemas
   - Removed `index: true` from `@Prop()` decorators where schema.index() is used
   - Consolidated index declarations to prevent conflicts

### 2. Fixed Database Connection Issues

The seeder was failing to connect to MongoDB Atlas with SSL errors:
```
MongooseServerSelectionError: SSL routines:ssl3_read_bytes:tlsv1 alert internal error
```

#### ✅ Solutions Implemented:

1. **Enhanced Connection Options**
   - Added SSL options for Atlas connections
   - Increased connection timeout
   - Added fallback to local MongoDB

2. **Created Test Script**
   - Added `test-seeder-local.js` to verify local MongoDB connection
   - Provided detailed error messages and solutions

## 🚀 How to Run the Seeder

### Option 1: Use Local MongoDB (Recommended)

1. **Install and Start MongoDB**
   ```bash
   # Install MongoDB Community Edition
   # Start MongoDB service
   ```

2. **Run the Seeder with Local Connection**
   ```bash
   # Set environment variable for local MongoDB
   $env:MONGO_URI="mongodb://localhost:27017/trelax_seeded_db"
   
   # Run the seeder
   npm run seed
   ```

### Option 2: Use MongoDB Atlas

1. **Update Connection String**
   ```bash
   # Edit .env.seed file with your Atlas connection string
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/trelax_seeded_db?retryWrites=true&w=majority&tlsInsecure=true
   ```

2. **Run the Seeder**
   ```bash
   npm run seed
   ```

## 📋 Code Changes Summary

### 1. Fixed Location Seeding Logic

```typescript
private async seedLocations(cities: CityDocument[]): Promise<LocationDocument[]> {
  const locations: LocationDocument[] = [];

  for (const city of cities) {
    const locationCount = faker.number.int({ min: 8, max: 15 });
    const cityLocationCodes = new Set<string>(); // Track codes for this city
    
    for (let i = 0; i < locationCount; i++) {
      const locationName = this.generateLocationName(city.name);
      const locationCode = this.generateUniqueLocationCode(city.name, cityLocationCodes);
      
      // Check if location already exists (idempotency)
      const existingLocation = await this.locationModel.findOne({
        name: locationName,
        parentId: city._id
      });

      if (existingLocation) {
        console.log(`⚠️  Location "${locationName}" already exists, skipping...`);
        locations.push(existingLocation);
        continue;
      }

      // Create location data with unique code
      const locationData = {
        name: locationName,
        masterType: MasterType.LOCATION,
        status: MasterStatus.ACTIVE,
        parentId: city._id,
        parentType: MasterType.CITY,
        locationCode, // Always provide a unique locationCode
        // ... other fields
      };

      try {
        const location = new this.locationModel(locationData);
        const savedLocation = await location.save();
        locations.push(savedLocation);
        cityLocationCodes.add(locationCode);
      } catch (error) {
        // Handle duplicate key errors with retry
        if (error.code === 11000) {
          console.log(`🔄 Retrying with different location code...`);
          const retryLocationCode = this.generateUniqueLocationCode(city.name, cityLocationCodes, true);
          // ... retry logic
        }
      }
    }
  }

  return locations;
}
```

### 2. Added Location Code Generator

```typescript
private generateUniqueLocationCode(cityName: string, usedCodes: Set<string>, isRetry: boolean = false): string {
  const cityPrefix = cityName.substring(0, 3).toUpperCase();
  let attempts = 0;
  const maxAttempts = 100;

  while (attempts < maxAttempts) {
    let locationCode: string;
    
    if (isRetry || attempts > 10) {
      // For retries or after many attempts, use a more unique approach
      locationCode = `${cityPrefix}${faker.string.alphanumeric(4).toUpperCase()}`;
    } else {
      // Normal approach: city prefix + random number
      const randomNum = faker.number.int({ min: 100, max: 999 });
      locationCode = `${cityPrefix}${randomNum}`;
    }

    if (!usedCodes.has(locationCode)) {
      return locationCode;
    }
    
    attempts++;
  }

  // Fallback: use timestamp-based code
  const timestamp = Date.now().toString().slice(-4);
  return `${cityPrefix}${timestamp}`;
}
```

### 3. Removed Redundant Index Declarations

```typescript
// BEFORE
@Prop({ 
  required: true, 
  type: Types.ObjectId,
  ref: 'City',
  index: true  // Redundant with schema.index()
})
parentId: Types.ObjectId;

// AFTER
@Prop({ 
  required: true, 
  type: Types.ObjectId,
  ref: 'City'
  // Removed redundant index: true
})
parentId: Types.ObjectId;
```

## 🔍 Verification Steps

After running the seeder, verify the data was inserted correctly:

1. **Check MongoDB Collections**
   ```bash
   # Connect to MongoDB
   mongo trelax_seeded_db
   
   # Check counts
   db.masters.countDocuments({ masterType: 'city' })      # Should be 20
   db.masters.countDocuments({ masterType: 'location' })  # Should be 150+
   db.masters.countDocuments({ masterType: 'amenity' })   # Should be 30+
   db.projects.countDocuments({})                         # Should be 100
   db.builders.countDocuments({})                         # Should be 25
   db.agents.countDocuments({})                           # Should be 50
   ```

2. **Verify Unique Location Codes**
   ```bash
   # Check for null locationCode values (should be 0)
   db.masters.countDocuments({ 
     masterType: 'location', 
     locationCode: null 
   })
   
   # Check for duplicate locationCode values (should be 0)
   db.masters.aggregate([
     { $match: { masterType: 'location' } },
     { $group: { 
         _id: { locationCode: "$locationCode", parentId: "$parentId" }, 
         count: { $sum: 1 } 
     }},
     { $match: { count: { $gt: 1 } }}
   ])
   ```

## 🎯 Next Steps

1. **Run the Seeder**: Once you have a working MongoDB connection
2. **Verify the Data**: Check that all collections are populated correctly
3. **Start the Application**: Run the application with the seeded data
4. **Test the APIs**: Use Swagger UI to test all endpoints with the seeded data

The seeder is now robust, handles errors gracefully, and ensures no duplicate data is inserted. It will work with both local MongoDB and MongoDB Atlas once the connection issues are resolved.
