# 🌱 Database Seeding Guide

## 📋 Overview

This guide explains how to populate your TrelaX Core Admin Backend database with comprehensive sample data including cities, locations, amenities, builders, agents, and realistic real estate projects.

## 🎯 What Gets Seeded

### 🏙️ **Master Data (300+ records)**
- **20 Indian Cities** with coordinates, states, and metadata
- **200+ Locations** distributed across cities with geo-coordinates
- **30+ Amenities** categorized by type (Sports, Security, Convenience, etc.)
- **Property Configuration Data**:
  - 14 Floor types (Basement to Penthouse)
  - 10 Tower configurations
  - 12 Property types (Residential & Commercial)
  - 7 Room configurations (Studio to 6+ BHK)
  - 5 Washroom configurations

### 🏗️ **Business Entities (75 records)**
- **25 Real Estate Builders** with complete profiles
- **50 Real Estate Agents** with contact details and licenses

### 🏢 **Projects (100 records)**
- **100 Realistic Projects** with:
  - Complete location details with geo-coordinates
  - Multiple unit configurations per project
  - 5-15 amenities per project
  - Media URLs (images, videos, brochures, floor plans)
  - Document URLs (approvals, certificates, legal docs)
  - Pricing information and availability
  - Project status and possession details

## 🚀 Quick Start

### 1. **Install Dependencies**
```bash
npm install
```

### 2. **Set Database Connection**

**Option A: Use New Database (Recommended)**
```bash
# Copy the seed environment file
cp .env.seed .env

# This will create a new database: trelax_seeded_db
```

**Option B: Use Custom Database**
```bash
# Edit .env file and update MONGO_URI
MONGO_URI=mongodb://localhost:27017/your_custom_db_name
# OR for MongoDB Atlas:
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/your_db_name
```

### 3. **Run the Seeder**
```bash
# Development mode (with TypeScript)
npm run seed

# Production mode (requires build first)
npm run build
npm run seed:prod
```

### 4. **Start the Application**
```bash
npm run start:dev
```

### 5. **Access the Application**
- **API Base**: `http://localhost:3000/api/v1`
- **Swagger Docs**: `http://localhost:3000/api/v1/docs`
- **Login**: `admin@trelax.com` / `admin123`

## 📊 Seeded Data Details

### 🏙️ Cities
```
Mumbai, Delhi, Bangalore, Hyderabad, Chennai, Kolkata, Pune, 
Ahmedabad, Jaipur, Surat, Lucknow, Kanpur, Nagpur, Indore, 
Thane, Bhopal, Visakhapatnam, Pimpri-Chinchwad, Patna, Vadodara
```

### 🏊 Amenities Categories
- **Sports & Recreation**: Swimming Pool, Gymnasium, Tennis Court, etc.
- **Security**: 24/7 Security, CCTV Surveillance, Access Control, etc.
- **Convenience**: Elevator, Power Backup, Parking, etc.
- **Entertainment**: Clubhouse, Party Hall, Library, etc.
- **Wellness**: Spa, Sauna, Meditation Center, etc.
- **Outdoor**: Garden, Children's Play Area, BBQ Area, etc.

### 🏗️ Builders
```
Lodha Group, Godrej Properties, DLF Limited, Oberoi Realty,
Prestige Group, Brigade Group, Sobha Limited, Puravankara Limited,
Mahindra Lifespace, Tata Housing, Hiranandani Group, etc.
```

### 🏢 Project Features
- **Realistic Names**: "Royal Heights Phase 1", "Grand Residency", etc.
- **Multiple Unit Types**: Studio, 1-6 BHK, Villas, Penthouses
- **Comprehensive Pricing**: ₹30L - ₹5Cr based on location and type
- **Rich Media**: 5-20 images, videos, brochures per project
- **Complete Documentation**: RERA certificates, approvals, legal docs

## 🔧 Customization

### Modify Seeding Data

**1. Edit Cities**
```typescript
// src/database/seeders/comprehensive.seeder.ts
const indianCities = [
  { name: 'YourCity', state: 'YourState', coordinates: [lng, lat] },
  // Add more cities
];
```

**2. Add Custom Amenities**
```typescript
const amenitiesData = [
  { name: 'Your Amenity', category: AmenityCategory.SPORTS, icon: 'icon', importance: 4 },
  // Add more amenities
];
```

**3. Modify Project Count**
```typescript
const projectCount = 50; // Change from 100 to your desired number
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/trelax_seeded_db` |
| `JWT_SECRET` | JWT secret key | Required |
| `AWS_*` | AWS S3 configuration | Required for file uploads |

## 🧹 Database Management

### Clear Existing Data
The seeder automatically clears existing data before seeding. To manually clear:

```typescript
// In your application
const seeder = new ComprehensiveSeeder(/* models */);
await seeder.clearDatabase();
```

### Partial Seeding
You can run individual seeding methods:

```typescript
const cities = await seeder.seedCities();
const amenities = await seeder.seedAmenities();
// etc.
```

## 🔍 Verification

After seeding, verify the data:

### 1. **Check Counts**
```bash
# Using MongoDB shell or Compass
db.masters.countDocuments({ masterType: 'city' })      // Should be 20
db.masters.countDocuments({ masterType: 'amenity' })   // Should be 30+
db.projects.countDocuments({})                         // Should be 100
db.builders.countDocuments({})                         // Should be 25
db.agents.countDocuments({})                           // Should be 50
```

### 2. **Test APIs**
```bash
# Get all cities
curl http://localhost:3000/api/v1/masters/cities

# Get all projects
curl http://localhost:3000/api/v1/projects

# Login and test authenticated endpoints
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@trelax.com","password":"admin123"}'
```

## 🚨 Troubleshooting

### Common Issues

**1. Connection Timeout**
```bash
# Increase timeout in seed.command.ts
serverSelectionTimeoutMS: 10000, // Increase from 5000
```

**2. Memory Issues**
```bash
# Reduce batch sizes in seeder
const projectCount = 50; // Reduce from 100
```

**3. Duplicate Key Errors**
```bash
# Clear database first
npm run seed
```

**4. Missing Dependencies**
```bash
npm install @faker-js/faker --save-dev
```

## 📈 Performance Tips

1. **Use Indexes**: The seeder creates appropriate indexes automatically
2. **Batch Operations**: Large datasets are processed in batches
3. **Connection Pooling**: Configured for optimal performance
4. **Memory Management**: Efficient data generation and cleanup

## 🎉 Success Indicators

After successful seeding, you should see:

```
✅ Database cleared
✅ Seeded 20 cities
✅ Seeded 200+ locations
✅ Seeded 30+ amenities
✅ Seeded 14 floors
✅ Seeded 10 towers
✅ Seeded 12 property types
✅ Seeded 7 rooms
✅ Seeded 5 washrooms
✅ Seeded 25 builders
✅ Seeded 50 agents
✅ Seeded 100 projects
✅ Database seeding completed successfully!
```

## 🔗 Next Steps

1. **Explore APIs**: Use Swagger UI to test all endpoints
2. **Create Projects**: Add new projects using the seeded master data
3. **Upload Files**: Test file upload functionality
4. **Analytics**: Check project statistics and reports
5. **Customize**: Modify seeded data to match your requirements

---

**Happy Seeding! 🌱**
