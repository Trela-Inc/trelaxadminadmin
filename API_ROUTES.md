# TrelaX Core Admin Backend - API Routes Documentation

## 🌐 Base URL
```
http://localhost:3000/api/v1
```

## 📚 API Documentation
```
http://localhost:3000/api/v1/docs
```

---

## 🔐 Authentication Routes

### Admin Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@trelax.com",
  "password": "admin123"
}
```

### Get Admin Profile
```http
GET /api/v1/auth/profile
Authorization: Bearer <jwt_token>
```

### Refresh Token
```http
POST /api/v1/auth/refresh
Authorization: Bearer <jwt_token>
```

**Default Admin Accounts:**
- `admin@trelax.com` / `admin123`
- `superadmin@trelax.com` / `admin123`
- `manager@trelax.com` / `admin123`

---

## 🏢 Projects Routes

### Create Project
```http
POST /api/v1/projects
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Luxury Apartments",
  "description": "Premium residential project",
  "builder": "ABC Builders",
  "status": "Under Construction",
  "city": "Mumbai",
  "location": "Bandra West",
  "reraNumber": "P51800000001",
  "amenities": ["Swimming Pool", "Gym", "Garden"],
  "totalUnits": 100,
  "priceRange": {
    "min": 5000000,
    "max": 15000000
  }
}
```

### Get All Projects
```http
GET /api/v1/projects?page=1&limit=10&search=luxury&city=Mumbai&status=active
Authorization: Bearer <jwt_token>
```

### Get Project by ID
```http
GET /api/v1/projects/:id
Authorization: Bearer <jwt_token>
```

### Update Project
```http
PATCH /api/v1/projects/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Updated Project Name",
  "status": "Ready to Move"
}
```

### Delete Project
```http
DELETE /api/v1/projects/:id
Authorization: Bearer <jwt_token>
```

### Upload Project Media
```http
POST /api/v1/projects/:id/media
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

files: [image1.jpg, image2.jpg]
```

### Delete Project Media
```http
DELETE /api/v1/projects/:id/media/:mediaId
Authorization: Bearer <jwt_token>
```

### Upload Project Documents
```http
POST /api/v1/projects/:id/documents
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

files: [brochure.pdf, floorplan.pdf]
```

### Delete Project Document
```http
DELETE /api/v1/projects/:id/documents/:documentId
Authorization: Bearer <jwt_token>
```

### Search Projects by Location
```http
GET /api/v1/projects/search/location?latitude=19.0760&longitude=72.8777&radius=5
Authorization: Bearer <jwt_token>
```

### Get Featured Projects
```http
GET /api/v1/projects/featured?limit=10
Authorization: Bearer <jwt_token>
```

### Get Projects Statistics
```http
GET /api/v1/projects/statistics
Authorization: Bearer <jwt_token>
```

---

## 🎛️ Masters Routes (Form Dropdowns)

### Create Master Field
```http
POST /api/v1/masters
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "fieldType": "city",
  "name": "Nashik",
  "description": "Wine capital of India",
  "status": "active",
  "sortOrder": 9,
  "isDefault": false
}
```

### Get All Master Fields
```http
GET /api/v1/masters?page=1&limit=10&fieldType=amenity&status=active
Authorization: Bearer <jwt_token>
```

### Get Master Field by ID
```http
GET /api/v1/masters/:id
Authorization: Bearer <jwt_token>
```

### Update Master Field
```http
PATCH /api/v1/masters/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Updated Name",
  "sortOrder": 1
}
```

### Delete Master Field
```http
DELETE /api/v1/masters/:id
Authorization: Bearer <jwt_token>
```

### Get Cities (Dropdown)
```http
GET /api/v1/masters/cities
Authorization: Bearer <jwt_token>
```

### Get Locations by City (Dropdown)
```http
GET /api/v1/masters/locations/:cityId
Authorization: Bearer <jwt_token>
```

### Get Amenities (Dropdown)
```http
GET /api/v1/masters/amenities
Authorization: Bearer <jwt_token>
```

### Get Bedrooms (Dropdown)
```http
GET /api/v1/masters/bedrooms
Authorization: Bearer <jwt_token>
```

### Get Bathrooms (Dropdown)
```http
GET /api/v1/masters/bathrooms
Authorization: Bearer <jwt_token>
```

### Get Masters Statistics
```http
GET /api/v1/masters/statistics
Authorization: Bearer <jwt_token>
```

---

## 📁 Files Routes

### Upload File
```http
POST /api/v1/files/upload
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

file: <file>
category: "project_media"
```

### Get File Details
```http
GET /api/v1/files/:id
Authorization: Bearer <jwt_token>
```

### Delete File
```http
DELETE /api/v1/files/:id
Authorization: Bearer <jwt_token>
```

### Download File
```http
GET /api/v1/files/:id/download
Authorization: Bearer <jwt_token>
```

### Get Files by User
```http
GET /api/v1/files/user/:userId?page=1&limit=10
Authorization: Bearer <jwt_token>
```

---

## 📊 Response Format

All API responses follow this standard format:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## 🔑 Authentication

All routes except `/auth/login` require JWT authentication:

```http
Authorization: Bearer <your_jwt_token>
```

Get your JWT token by logging in with admin credentials.

---

## 🚀 Getting Started

1. **Start the server**: `npm run start:dev`
2. **Login**: POST to `/api/v1/auth/login` with admin credentials
3. **Use the JWT token**: Include in Authorization header for all other requests
4. **Explore API**: Visit `/api/v1/docs` for interactive Swagger documentation
