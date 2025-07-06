# Masters Module - Simple Form Fields Management

## Overview

The Masters Module provides a simple CRUD system for managing all dropdown fields used in forms throughout the real estate application. Admin users can easily add, edit, and delete options for cities, locations, amenities, bedrooms, bathrooms, and other form fields.

## Key Features

### 🏙️ Cities Management
- Simple list of cities for project location selection
- Custom sorting for better user experience
- Mark default/popular cities

### 📍 Locations Management
- Locations within cities (hierarchical structure)
- Parent-child relationship (City → Location)
- Easy dropdown population based on selected city

### 🏊 Amenities Management
- Simple list of amenities for project features
- Common amenities like Swimming Pool, Gym, Garden, etc.
- Mark popular amenities as defaults

### 🛏️ Bedrooms & Bathrooms
- Configure bedroom options (1 BHK, 2 BHK, 3 BHK, etc.)
- Configure bathroom options (1 Bathroom, 2 Bathrooms, etc.)
- Numeric values for filtering and sorting

### 📊 Project Status & Property Types
- Project status options (Planned, Under Construction, Ready to Move, etc.)
- Property types (Residential, Commercial, Mixed Use, etc.)
- Builder types and other configurable fields

## API Endpoints

### Cities
```
POST   /api/v1/masters/cities              # Create city
GET    /api/v1/masters/cities              # List cities (with filtering)
GET    /api/v1/masters/cities/:id          # Get city details
PATCH  /api/v1/masters/cities/:id          # Update city
DELETE /api/v1/masters/cities/:id          # Delete city
```

### Locations
```
POST   /api/v1/masters/locations           # Create location
GET    /api/v1/masters/locations           # List locations (with filtering)
GET    /api/v1/masters/locations/city/:id  # Get locations by city
PATCH  /api/v1/masters/locations/:id       # Update location
DELETE /api/v1/masters/locations/:id       # Delete location
```

### Amenities
```
POST   /api/v1/masters/amenities                    # Create amenity
GET    /api/v1/masters/amenities                    # List amenities (with filtering)
GET    /api/v1/masters/amenities/category/:category # Get amenities by category
PATCH  /api/v1/masters/amenities/:id                # Update amenity
DELETE /api/v1/masters/amenities/:id                # Delete amenity
```

### Builders
```
POST   /api/v1/masters/builders            # Create builder
GET    /api/v1/masters/builders            # List builders (with filtering)
GET    /api/v1/masters/builders/:id        # Get builder details
PATCH  /api/v1/masters/builders/:id        # Update builder
DELETE /api/v1/masters/builders/:id        # Delete builder
```

### Statistics
```
GET    /api/v1/masters/statistics          # Get comprehensive statistics
```

## Integration with Projects Module

The Masters Module seamlessly integrates with the Projects Module to provide:

1. **Dynamic Dropdowns**: Cities and locations populate project form dropdowns
2. **Amenity Selection**: Categorized amenity lists for project features
3. **Builder Profiles**: Pre-filled builder information in project forms
4. **Data Validation**: Ensures only valid master data is used in projects
5. **Consistency**: Single source of truth prevents data duplication

## Usage Examples

### Creating a New City
```json
POST /api/v1/masters/cities
{
  "name": "Mumbai",
  "state": "Maharashtra",
  "country": "India",
  "code": "MUM",
  "description": "Financial capital of India",
  "coordinates": [72.8777, 19.0760],
  "timezone": "Asia/Kolkata",
  "pinCodes": ["400001", "400002", "400003"],
  "isPopular": true,
  "sortOrder": 1
}
```

### Getting Locations for a City
```
GET /api/v1/masters/locations/city/507f1f77bcf86cd799439011
```

### Filtering Amenities by Category
```
GET /api/v1/masters/amenities/category/basic
```

### Searching Builders
```
GET /api/v1/masters/builders?search=lodha&isFeatured=true&minRating=4
```

## Data Seeding

The module includes a comprehensive seeder (`masters.seeder.ts`) that populates:
- 5 major Indian cities (Mumbai, Pune, Bangalore, Delhi, Gurgaon)
- 35+ categorized amenities with icons and popularity flags
- 3 featured builders with complete profiles

To run the seeder:
```typescript
// In your application startup or migration script
const seeder = new MastersSeeder(cityModel, locationModel, amenityModel, builderModel);
await seeder.seedAll(adminUserId);
```

## Best Practices

### 1. Data Consistency
- Always use master data IDs in projects instead of free text
- Validate foreign key relationships before creating projects
- Maintain referential integrity between cities and locations

### 2. Performance Optimization
- Use pagination for large datasets
- Implement proper indexing on frequently queried fields
- Cache popular master data for faster access

### 3. User Experience
- Mark popular items for quick access
- Implement search functionality across all master data
- Provide clear categorization for amenities

### 4. Data Management
- Regular cleanup of unused master data
- Monitor usage statistics to identify popular items
- Implement soft deletes to maintain data history

## Security Considerations

- All endpoints require JWT authentication
- Role-based access control for master data management
- Audit trail for all create/update/delete operations
- Input validation and sanitization for all fields

## Future Enhancements

1. **Bulk Import/Export**: Excel/CSV import for master data
2. **Approval Workflow**: Multi-level approval for new master data
3. **Localization**: Multi-language support for master data
4. **API Integration**: Integration with external data sources
5. **Advanced Analytics**: Usage patterns and trends analysis
6. **Mobile App Support**: Optimized APIs for mobile applications

## Conclusion

The Masters Module provides a robust foundation for managing all configurable data in the real estate application. Its hierarchical structure, comprehensive feature set, and seamless integration with other modules make it an essential component for maintaining data consistency and providing excellent user experience.
