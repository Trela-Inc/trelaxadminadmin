# 🌱 Database Seeder Summary

## 📋 Overview

I've created a comprehensive database seeder for your TrelaX Core Admin Backend. This seeder will populate your database with realistic data for all modules, including cities, locations, amenities, builders, agents, and projects.

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

## 🚀 How to Use the Seeder

### 1. **Setup**

The seeder is already set up in your project:
- `src/database/seeders/comprehensive.seeder.ts` - Main seeder class
- `src/database/seeders/seed.command.ts` - Command to run the seeder
- `.env.seed` - Environment file for seeding
- `DATABASE_SEEDING_GUIDE.md` - Detailed guide

### 2. **Connection Issues**

We encountered SSL connection issues with MongoDB Atlas. To resolve this:

**Option A: Use Local MongoDB**
```bash
# Install MongoDB locally if not already installed
# Start MongoDB service
# Then update .env.seed with:
MONGO_URI=mongodb://localhost:27017/trelax_seeded_db
```

**Option B: Fix Atlas Connection**
```bash
# Update .env.seed with your MongoDB Atlas connection string
# Make sure to include the correct database name and parameters:
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/trelax_seeded_db?retryWrites=true&w=majority
```

**Option C: Manual Seeding**
You can manually seed the database using the MongoDB shell or Compass:
1. Create collections: `masters`, `projects`, `builders`, `agents`
2. Import the sample data from the JSON files provided

### 3. **Running the Seeder**

```bash
# Using npm script
npm run seed

# Or directly
ts-node -r tsconfig-paths/register src/database/seeders/seed.command.ts
```

## 📊 Sample Data

### 🏙️ Cities
```
Mumbai, Delhi, Bangalore, Hyderabad, Chennai, Kolkata, Pune, 
Ahmedabad, Jaipur, Surat, Lucknow, Kanpur, Nagpur, Indore, 
Thane, Bhopal, Visakhapatnam, Pimpri-Chinchwad, Patna, Vadodara
```

### 🏊 Amenities Categories
- **Sports**: Swimming Pool, Gymnasium, Tennis Court, etc.
- **Security**: 24/7 Security, CCTV Surveillance, Access Control, etc.
- **Convenience**: Elevator, Power Backup, Parking, etc.
- **Community**: Clubhouse, Party Hall, Library, etc.
- **Wellness**: Spa, Sauna, Meditation Center, etc.
- **Recreational**: Garden, Children's Play Area, BBQ Area, etc.

### 🏗️ Builders
```
Lodha Group, Godrej Properties, DLF Limited, Oberoi Realty,
Prestige Group, Brigade Group, Sobha Limited, Puravankara Limited,
Mahindra Lifespace, Tata Housing, Hiranandani Group, etc.
```

## 🔧 Customization

You can customize the seeder by modifying:

1. **Number of Records**
```typescript
// src/database/seeders/comprehensive.seeder.ts
const projectCount = 50; // Change from 100 to your desired number
```

2. **Cities**
```typescript
// src/database/seeders/comprehensive.seeder.ts
const indianCities = [
  { name: 'YourCity', state: 'YourState', coordinates: [lng, lat] },
  // Add more cities
];
```

3. **Amenities**
```typescript
// src/database/seeders/comprehensive.seeder.ts
const amenitiesData = [
  { name: 'Your Amenity', category: AmenityCategory.SPORTS, icon: 'icon', importance: 4 },
  // Add more amenities
];
```

## 🧹 Troubleshooting

### Common Issues

**1. Connection Errors**
```
MongooseServerSelectionError: connect ECONNREFUSED
```
- Make sure MongoDB is running locally or your Atlas connection string is correct
- Check network connectivity and firewall settings

**2. SSL Errors**
```
SSL routines:ssl3_read_bytes:tlsv1 alert internal error
```
- Try adding `tlsInsecure=true` to your connection string
- Or use a different MongoDB version/provider

**3. Duplicate Key Errors**
```
E11000 duplicate key error collection
```
- Clear the database first or use a different database name
- The seeder automatically clears existing data before seeding

## 📈 Next Steps

1. **Start the Application**
```bash
npm run start:dev
```

2. **Access the Application**
- **API Base**: `http://localhost:3000/api/v1`
- **Swagger Docs**: `http://localhost:3000/api/v1/docs`
- **Login**: `admin@trelax.com` / `admin123`

3. **Explore the Data**
- Use the Swagger UI to browse all the seeded data
- Test the filtering and search functionality
- Create new projects using the seeded master data

## 🎉 Conclusion

The seeder is ready to use once you resolve the connection issues. It will populate your database with comprehensive, realistic data for all modules, making development and testing much easier.

If you need any further customization or have any questions, please let me know!

---

**Happy Seeding! 🌱**
