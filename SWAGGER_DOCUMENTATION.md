# 📚 TrelaX API - Swagger Documentation Guide

## 🌐 Access Swagger UI

### Development Environment
```
http://localhost:3000/api/v1/docs
```

### Production Environment
```
https://api.trelax.com/api/v1/docs
```

---

## 🎯 Features Available in Swagger UI

### ✅ **Interactive API Testing**
- **Try It Out**: Test all endpoints directly from the browser
- **Real-time Responses**: See actual API responses
- **Request/Response Examples**: Comprehensive examples for all endpoints
- **Schema Validation**: Input validation with error messages

### ✅ **Authentication Integration**
- **JWT Token Support**: Built-in authorization testing
- **Persistent Authorization**: Token persists across browser sessions
- **One-Click Login**: Test login and automatically use the token

### ✅ **Comprehensive Documentation**
- **Detailed Descriptions**: Every endpoint has detailed explanations
- **Parameter Documentation**: All query parameters, path parameters, and request bodies
- **Response Schemas**: Complete response structure documentation
- **Error Handling**: All possible error responses documented

### ✅ **Enhanced User Experience**
- **Organized by Modules**: APIs grouped by functionality
- **Search & Filter**: Find endpoints quickly
- **Request Duration**: See how long each request takes
- **Custom Styling**: Clean, professional interface

---

## 🔐 How to Use Authentication in Swagger

### Step 1: Login to Get JWT Token
1. Navigate to **🔐 Authentication** section
2. Click on **POST /auth/login**
3. Click **"Try it out"**
4. Use these credentials:
   ```json
   {
     "email": "admin@trelax.com",
     "password": "admin123"
   }
   ```
5. Click **"Execute"**
6. Copy the `accessToken` from the response

### Step 2: Authorize All Requests
1. Click the **"Authorize"** button at the top of the page
2. Paste your JWT token in the **"Value"** field
3. Click **"Authorize"**
4. Click **"Close"**

### Step 3: Test Protected Endpoints
- All endpoints now include your JWT token automatically
- Green lock icons indicate authenticated endpoints
- Test any endpoint without manually adding headers

---

## 📋 API Modules Overview

### 🔐 **Authentication Module**
**Endpoints: 3**
- `POST /auth/login` - Admin login with credentials
- `GET /auth/profile` - Get current admin profile
- `POST /auth/refresh` - Refresh JWT token

**Key Features:**
- Predefined admin accounts (no registration needed)
- JWT token-based authentication
- Role-based access control

### 🏢 **Projects Module**
**Endpoints: 12**
- **CRUD Operations**: Create, read, update, delete projects
- **Media Management**: Upload/delete project images and videos
- **Document Management**: Upload/delete project documents
- **Advanced Search**: Location-based search with coordinates
- **Featured Projects**: Get highlighted projects
- **Statistics**: Project analytics and counts

**Key Features:**
- Complete real estate project lifecycle management
- AWS S3 integration for media storage
- Geospatial search capabilities
- RERA compliance tracking
- Unit configuration management

### 🎛️ **Masters Module**
**Endpoints: 11**
- **CRUD Operations**: Manage all form dropdown fields
- **Dropdown APIs**: Get cities, locations, amenities, etc.
- **Hierarchical Data**: Locations under cities
- **Statistics**: Master data analytics

**Key Features:**
- Centralized dropdown management
- Support for hierarchical data (city → location)
- Custom sorting and default values
- Multiple field types (cities, amenities, bedrooms, etc.)

### 📁 **Files Module**
**Endpoints: 5**
- **Upload**: Single and multiple file uploads to AWS S3
- **Download**: Secure file downloads with presigned URLs
- **Management**: File metadata and organization
- **User Files**: Get files uploaded by specific users

**Key Features:**
- AWS S3 integration with organized folder structure
- Support for images, videos, documents
- File categorization and metadata
- Secure presigned URL downloads

---

## 🧪 Testing Scenarios

### **Scenario 1: Complete Project Creation**
1. **Login**: Get JWT token
2. **Get Master Data**: Fetch cities and amenities for dropdowns
3. **Create Project**: Create a new real estate project
4. **Upload Media**: Add project images
5. **Upload Documents**: Add project brochures
6. **Verify**: Get project details to confirm creation

### **Scenario 2: Master Data Management**
1. **Login**: Get JWT token
2. **Create City**: Add a new city option
3. **Create Location**: Add location under the city
4. **Create Amenity**: Add a new amenity option
5. **Test Dropdowns**: Verify new options appear in dropdown APIs

### **Scenario 3: File Management**
1. **Login**: Get JWT token
2. **Upload File**: Upload an image or document
3. **Get File Details**: Retrieve file metadata
4. **Download File**: Test file download functionality
5. **Delete File**: Remove file from system

---

## 📊 Response Examples

### **Success Response**
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Example Data"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### **Paginated Response**
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

### **Error Response**
```json
{
  "success": false,
  "message": "Operation failed",
  "error": "Detailed error description",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## 🔧 Advanced Features

### **Query Parameters**
- **Pagination**: `?page=1&limit=10`
- **Search**: `?search=luxury`
- **Filtering**: `?status=active&city=Mumbai`
- **Sorting**: `?sortBy=createdAt&sortOrder=desc`

### **File Uploads**
- **Single File**: Use `file` parameter
- **Multiple Files**: Use `files` parameter
- **Categories**: Specify file category for organization
- **Validation**: Automatic file type and size validation

### **Geospatial Queries**
- **Location Search**: `?latitude=19.0760&longitude=72.8777&radius=5`
- **Coordinate-based**: Find projects within specified radius
- **Distance Calculation**: Automatic distance sorting

---

## 🚀 Quick Start Checklist

- [ ] Access Swagger UI at `/api/v1/docs`
- [ ] Login with admin credentials
- [ ] Authorize with JWT token
- [ ] Test a simple GET endpoint
- [ ] Try creating a master field
- [ ] Upload a test file
- [ ] Create a sample project
- [ ] Explore all available endpoints

---

## 💡 Tips for Effective Testing

1. **Start with Authentication**: Always login first
2. **Use Real Data**: Test with realistic project information
3. **Test Error Cases**: Try invalid inputs to see error handling
4. **Check Responses**: Verify response structure and data
5. **Test Pagination**: Try different page sizes and numbers
6. **Use Filters**: Test search and filtering capabilities
7. **Upload Files**: Test file upload with different file types
8. **Check Relationships**: Test hierarchical data (cities → locations)

The Swagger UI provides a complete, interactive testing environment for the TrelaX API. Use it to explore all features, test integrations, and understand the API structure before building your frontend application!
