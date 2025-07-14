# 🏢 Projects API - Complete Examples

## 📋 POST /projects - Create Project with File Uploads

### 🎯 **Method 1: Form Data with File Uploads (Recommended)**

**Content-Type:** `multipart/form-data`

**Form Fields:**
```
projectData: {JSON string containing project information}
projectImages: [file1.jpg, file2.jpg, file3.jpg]
floorPlanImages: [floorplan1.jpg, floorplan2.jpg]
brochurePdf: brochure.pdf
additionalDocuments: [doc1.pdf, doc2.pdf]
```

**Example projectData JSON (Using Master Field IDs):**
```json
{
  "projectName": "Luxury Heights Residency",
  "projectDescription": "Premium residential project with modern amenities and world-class facilities",
  "builder": {
    "name": "ABC Constructions",
    "description": "Leading real estate developer with 20+ years experience",
    "website": "https://abcconstructions.com",
    "contactEmail": "info@abcconstructions.com",
    "contactPhone": "+91-9876543210"
  },
  "projectStatus": "under_construction",
  "location": {
    "address": "123 Main Street, Bandra West",
    "cityId": "507f1f77bcf86cd799439011",
    "locationId": "507f1f77bcf86cd799439012",
    "state": "Maharashtra",
    "country": "India",
    "pincode": "400050",
    "landmark": "Near Bandra Station",
    "coordinates": [72.8777, 19.0760]
  },
  "propertyType": "residential",
  "unitConfigurations": [
    {
      "type": "apartment",
      "name": "2 BHK",
      "bedrooms": 2,
      "bathrooms": 2,
      "carpetArea": 850,
      "priceMin": 5000000,
      "priceMax": 7000000,
      "totalUnits": 50,
      "availableUnits": 25,
      "facing": ["north", "east"]
    },
    {
      "type": "apartment",
      "name": "3 BHK",
      "bedrooms": 3,
      "bathrooms": 3,
      "carpetArea": 1200,
      "priceMin": 8000000,
      "priceMax": 12000000,
      "totalUnits": 30,
      "availableUnits": 15,
      "facing": ["north", "west"]
    }
  ],
  "reraNumber": "P51800000001",
  "possessionStatus": "under_construction",
  "possessionDate": "2025-12-31",
  "totalArea": 50000,
  "totalUnits": 80,
  "totalFloors": 25,
  "totalTowers": 2,
  "priceMin": 5000000,
  "priceMax": 12000000,
  "pricePerSqFt": 8000,
  "amenities": {
    "amenityIds": [
      "507f1f77bcf86cd799439013",
      "507f1f77bcf86cd799439014",
      "507f1f77bcf86cd799439015",
      "507f1f77bcf86cd799439016",
      "507f1f77bcf86cd799439017"
    ]
  },
  "tags": ["luxury", "gated-community", "eco-friendly"],
  "highlights": "Prime location with excellent connectivity and world-class amenities",
  "approvalStatus": "approved",
  "nearbyFacilities": [
    "Metro Station - 500m",
    "Shopping Mall - 1km",
    "Hospital - 2km",
    "School - 800m"
  ],
  "isFeatured": true
}
```

**How to Get Master Field IDs:**
1. **Cities**: `GET /api/v1/masters/cities` - Get list of available cities
2. **Locations**: `GET /api/v1/masters/locations/{cityId}` - Get locations for selected city
3. **Amenities**: `GET /api/v1/masters/amenities` - Get list of available amenities

### 🎯 **Method 2: JSON Only (No File Uploads)**

**Content-Type:** `application/json`

```json
{
  "projectName": "Simple Test Project",
  "projectDescription": "A basic real estate project without file uploads",
  "builder": {
    "name": "Test Builder"
  },
  "projectStatus": "planned",
  "location": {
    "address": "123 Test Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "country": "India",
    "pincode": "400001"
  },
  "propertyType": "residential",
  "unitConfigurations": [
    {
      "type": "apartment",
      "name": "2 BHK",
      "bedrooms": 2,
      "bathrooms": 2,
      "carpetArea": 1000,
      "priceMin": 5000000,
      "priceMax": 8000000
    }
  ]
}
```

## 📊 **Expected Response Format**

### ✅ **Success Response (with uploaded files):**

```json
{
  "success": true,
  "message": "Project created successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "projectName": "Luxury Heights Residency",
    "projectDescription": "Premium residential project with modern amenities and world-class facilities",
    "builder": {
      "name": "ABC Constructions",
      "description": "Leading real estate developer with 20+ years experience",
      "website": "https://abcconstructions.com",
      "contactEmail": "info@abcconstructions.com",
      "contactPhone": "+91-9876543210"
    },
    "projectStatus": "under_construction",
    "location": {
      "address": "123 Main Street, Bandra West",
      "cityId": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Mumbai",
        "fieldType": "city"
      },
      "locationId": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Bandra West",
        "fieldType": "location"
      },
      "state": "Maharashtra",
      "country": "India",
      "pincode": "400050",
      "landmark": "Near Bandra Station",
      "coordinates": [72.8777, 19.0760]
    },
    "propertyType": "residential",
    "unitConfigurations": [
      {
        "type": "apartment",
        "name": "2 BHK",
        "bedrooms": 2,
        "bathrooms": 2,
        "carpetArea": 850,
        "priceMin": 5000000,
        "priceMax": 7000000,
        "totalUnits": 50,
        "availableUnits": 25,
        "facing": ["north", "east"]
      }
    ],
    "reraNumber": "P51800000001",
    "possessionStatus": "under_construction",
    "possessionDate": "2025-12-31",
    "totalArea": 50000,
    "totalUnits": 80,
    "totalFloors": 25,
    "totalTowers": 2,
    "priceMin": 5000000,
    "priceMax": 12000000,
    "pricePerSqFt": 8000,
    "amenities": {
      "amenityIds": [
        {
          "_id": "507f1f77bcf86cd799439013",
          "name": "Swimming Pool",
          "fieldType": "amenity",
          "description": "Olympic size swimming pool"
        },
        {
          "_id": "507f1f77bcf86cd799439014",
          "name": "Gymnasium",
          "fieldType": "amenity",
          "description": "Fully equipped modern gymnasium"
        },
        {
          "_id": "507f1f77bcf86cd799439015",
          "name": "Garden",
          "fieldType": "amenity",
          "description": "Landscaped garden area"
        },
        {
          "_id": "507f1f77bcf86cd799439016",
          "name": "CCTV Surveillance",
          "fieldType": "amenity",
          "description": "24/7 CCTV monitoring"
        },
        {
          "_id": "507f1f77bcf86cd799439017",
          "name": "Club House",
          "fieldType": "amenity",
          "description": "Community club house"
        }
      ]
    },
    "media": {
      "images": [
        "https://your-bucket.s3.amazonaws.com/projects/images/1640995200000-project-image1.jpg",
        "https://your-bucket.s3.amazonaws.com/projects/images/1640995201000-project-image2.jpg",
        "https://your-bucket.s3.amazonaws.com/projects/images/1640995202000-project-image3.jpg"
      ],
      "floorPlans": [
        "https://your-bucket.s3.amazonaws.com/projects/floorplans/1640995203000-floorplan1.jpg",
        "https://your-bucket.s3.amazonaws.com/projects/floorplans/1640995204000-floorplan2.jpg"
      ],
      "brochures": [
        "https://your-bucket.s3.amazonaws.com/projects/brochures/1640995205000-brochure.pdf"
      ],
      "videos": [],
      "masterPlan": [],
      "locationMap": []
    },
    "documents": {
      "approvals": [],
      "legalDocuments": [],
      "certificates": [],
      "others": [
        "https://your-bucket.s3.amazonaws.com/projects/documents/1640995206000-additional-doc1.pdf",
        "https://your-bucket.s3.amazonaws.com/projects/documents/1640995207000-additional-doc2.pdf"
      ]
    },
    "tags": ["luxury", "gated-community", "eco-friendly"],
    "highlights": "Prime location with excellent connectivity and world-class amenities",
    "approvalStatus": "approved",
    "nearbyFacilities": [
      "Metro Station - 500m",
      "Shopping Mall - 1km",
      "Hospital - 2km",
      "School - 800m"
    ],
    "isFeatured": true,
    "isActive": true,
    "createdBy": "admin1",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🔧 **File Upload Guidelines**

### **Supported File Types:**
- **Images**: JPG, JPEG, PNG, WebP (max 5MB each)
- **Documents**: PDF, DOC, DOCX (max 10MB each)
- **Videos**: MP4, MOV, AVI (max 50MB each)

### **File Organization in S3:**
```
your-s3-bucket/
├── projects/
│   ├── images/           # Project photos
│   ├── floorplans/       # Floor plan images
│   ├── brochures/        # PDF brochures
│   ├── documents/        # Additional documents
│   ├── videos/           # Project videos
│   ├── masterplan/       # Master plan images
│   └── locationmap/      # Location map images
```

### **File Naming Convention:**
- Format: `{timestamp}-{original-filename}`
- Example: `1640995200000-luxury-project-image.jpg`

## 🧪 **Testing Examples**

### **Using cURL:**
```bash
curl -X POST http://localhost:3000/api/v1/projects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "projectData={\"projectName\":\"Test Project\",\"projectDescription\":\"Test Description\",\"builder\":{\"name\":\"Test Builder\"},\"projectStatus\":\"planned\",\"location\":{\"address\":\"Test Address\",\"city\":\"Mumbai\",\"state\":\"Maharashtra\",\"country\":\"India\",\"pincode\":\"400001\"},\"propertyType\":\"residential\",\"unitConfigurations\":[{\"type\":\"apartment\",\"name\":\"2 BHK\",\"bedrooms\":2,\"bathrooms\":2,\"carpetArea\":1000,\"priceMin\":5000000,\"priceMax\":8000000}]}" \
  -F "projectImages=@image1.jpg" \
  -F "projectImages=@image2.jpg" \
  -F "floorPlanImages=@floorplan.jpg" \
  -F "brochurePdf=@brochure.pdf"
```

### **Using Postman:**
1. Set method to POST
2. URL: `http://localhost:3000/api/v1/projects`
3. Headers: `Authorization: Bearer YOUR_JWT_TOKEN`
4. Body: Select "form-data"
5. Add fields:
   - `projectData` (Text): Paste the JSON
   - `projectImages` (File): Select multiple images
   - `floorPlanImages` (File): Select floor plan images
   - `brochurePdf` (File): Select PDF brochure
   - `additionalDocuments` (File): Select additional documents

## 📋 **GET /projects Response**

When fetching projects, the response will include all uploaded file URLs:

```json
{
  "success": true,
  "message": "Projects retrieved successfully",
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "projectName": "Luxury Heights Residency",
      "projectStatus": "under_construction",
      "location": {
        "city": "Mumbai",
        "state": "Maharashtra"
      },
      "propertyType": "residential",
      "media": {
        "images": ["https://s3.amazonaws.com/bucket/projects/images/image1.jpg"],
        "floorPlans": ["https://s3.amazonaws.com/bucket/projects/floorplans/plan1.jpg"],
        "brochures": ["https://s3.amazonaws.com/bucket/projects/brochures/brochure.pdf"]
      },
      "documents": {
        "others": ["https://s3.amazonaws.com/bucket/projects/documents/doc1.pdf"]
      },
      "isFeatured": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

This comprehensive API now supports both project creation with file uploads and returns all S3 URLs in the response for easy frontend integration!
