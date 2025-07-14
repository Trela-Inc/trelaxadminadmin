# 📚 TrelaX Core Admin Backend - Complete API Documentation

## 🌐 Base URL
- **Development**: `http://localhost:3000/api/v1`
- **Production**: `https://api.trelax.com/api/v1`
- **Swagger UI**: `{BASE_URL}/docs`

## 🔐 Authentication

### Default Admin Credentials
```
📧 admin@trelax.com / admin123
📧 superadmin@trelax.com / admin123  
📧 manager@trelax.com / admin123
```

### Authentication Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/login` | Admin login with credentials |
| `GET` | `/auth/profile` | Get current admin profile |
| `POST` | `/auth/refresh` | Refresh JWT token |

---

## 🏢 Projects Management

### Core Project Operations
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/projects` | Create new project with media upload |
| `GET` | `/projects` | Get all projects with filtering & pagination |
| `GET` | `/projects/:id` | Get project by ID |
| `PATCH` | `/projects/:id` | Update project information |
| `DELETE` | `/projects/:id` | Soft delete project |

### Project Media & Documents
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/projects/:id/media/:type` | Upload project media (images, videos, floor plans) |
| `POST` | `/projects/:id/documents/:type` | Upload project documents (RERA, approvals) |

### Project Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/projects/admin/statistics` | Get project statistics and analytics |
| `GET` | `/projects/featured` | Get featured projects |

---

## 🎛️ Master Data Management

### 🏙️ Cities Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/masters/cities` | Create new city |
| `GET` | `/masters/cities` | Get all cities with filtering |
| `GET` | `/masters/cities/:id` | Get city by ID |
| `PATCH` | `/masters/cities/:id` | Update city information |
| `DELETE` | `/masters/cities/:id` | Delete city |
| `GET` | `/masters/cities/statistics` | Get city statistics |
| `GET` | `/masters/cities/popular` | Get popular cities |
| `GET` | `/masters/cities/by-state/:state` | Get cities by state |
| `GET` | `/masters/cities/by-country/:country` | Get cities by country |
| `GET` | `/masters/cities/near` | Get nearby cities (geo-search) |

### 📍 Locations Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/masters/locations` | Create new location |
| `GET` | `/masters/locations` | Get all locations with filtering |
| `GET` | `/masters/locations/:id` | Get location by ID |
| `PATCH` | `/masters/locations/:id` | Update location information |
| `DELETE` | `/masters/locations/:id` | Delete location |
| `GET` | `/masters/locations/statistics` | Get location statistics |
| `GET` | `/masters/locations/popular` | Get popular locations |
| `GET` | `/masters/locations/by-city/:cityId` | Get locations by city |
| `GET` | `/masters/locations/by-type/:type` | Get locations by type |
| `GET` | `/masters/locations/near` | Get nearby locations (geo-search) |

### 🏊 Amenities Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/masters/amenities` | Create new amenity |
| `GET` | `/masters/amenities` | Get all amenities with filtering |
| `GET` | `/masters/amenities/:id` | Get amenity by ID |
| `PATCH` | `/masters/amenities/:id` | Update amenity information |
| `DELETE` | `/masters/amenities/:id` | Delete amenity |
| `GET` | `/masters/amenities/statistics` | Get amenity statistics |
| `GET` | `/masters/amenities/popular` | Get popular amenities |
| `GET` | `/masters/amenities/category/:category` | Get amenities by category |
| `GET` | `/masters/amenities/importance/:level` | Get amenities by importance |
| `GET` | `/masters/amenities/residential` | Get residential amenities |
| `GET` | `/masters/amenities/commercial` | Get commercial amenities |
| `GET` | `/masters/amenities/luxury` | Get luxury amenities |
| `GET` | `/masters/amenities/basic` | Get basic amenities |
| `GET` | `/masters/amenities/search/tags` | Search amenities by tags |

### 🏢 Property Configuration

#### Floors Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/masters/floors` | Create new floor configuration |
| `GET` | `/masters/floors` | Get all floor configurations |
| `GET` | `/masters/floors/:id` | Get floor by ID |
| `PATCH` | `/masters/floors/:id` | Update floor configuration |
| `DELETE` | `/masters/floors/:id` | Delete floor configuration |
| `GET` | `/masters/floors/statistics` | Get floor statistics |
| `GET` | `/masters/floors/available` | Get available floors |
| `GET` | `/masters/floors/type/:type` | Get floors by type |
| `GET` | `/masters/floors/usage/:usage` | Get floors by usage |
| `GET` | `/masters/floors/range` | Get floor ranges |
| `GET` | `/masters/floors/basement` | Get basement floors |
| `GET` | `/masters/floors/ground` | Get ground floors |
| `GET` | `/masters/floors/upper` | Get upper floors |
| `GET` | `/masters/floors/premium` | Get premium floors |

#### Towers Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/masters/towers` | Create new tower configuration |
| `GET` | `/masters/towers` | Get all tower configurations |
| `GET` | `/masters/towers/:id` | Get tower by ID |
| `PATCH` | `/masters/towers/:id` | Update tower configuration |
| `DELETE` | `/masters/towers/:id` | Delete tower configuration |
| `GET` | `/masters/towers/statistics` | Get tower statistics |
| `GET` | `/masters/towers/active` | Get active towers |
| `GET` | `/masters/towers/type/:type` | Get towers by type |

#### Property Types Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/masters/property-types` | Create new property type |
| `GET` | `/masters/property-types` | Get all property types |
| `GET` | `/masters/property-types/:id` | Get property type by ID |
| `PATCH` | `/masters/property-types/:id` | Update property type |
| `DELETE` | `/masters/property-types/:id` | Delete property type |
| `GET` | `/masters/property-types/statistics` | Get property type statistics |
| `GET` | `/masters/property-types/category/:category` | Get property types by category |
| `GET` | `/masters/property-types/residential` | Get residential property types |
| `GET` | `/masters/property-types/commercial` | Get commercial property types |

#### Rooms Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/masters/rooms` | Create new room configuration |
| `GET` | `/masters/rooms` | Get all room configurations |
| `GET` | `/masters/rooms/:id` | Get room by ID |
| `PATCH` | `/masters/rooms/:id` | Update room configuration |
| `DELETE` | `/masters/rooms/:id` | Delete room configuration |
| `GET` | `/masters/rooms/statistics` | Get room statistics |
| `GET` | `/masters/rooms/type/:type` | Get rooms by type |

#### Washrooms Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/masters/washrooms` | Create new washroom configuration |
| `GET` | `/masters/washrooms` | Get all washroom configurations |
| `GET` | `/masters/washrooms/:id` | Get washroom by ID |
| `PATCH` | `/masters/washrooms/:id` | Update washroom configuration |
| `DELETE` | `/masters/washrooms/:id` | Delete washroom configuration |
| `GET` | `/masters/washrooms/statistics` | Get washroom statistics |
| `GET` | `/masters/washrooms/type/:type` | Get washrooms by type |

---

## 🏗️ Builders Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/builders` | Create new builder profile |
| `GET` | `/builders` | Get all builders with filtering |
| `GET` | `/builders/:id` | Get builder by ID |
| `PATCH` | `/builders/:id` | Update builder information |
| `DELETE` | `/builders/:id` | Delete builder |

---

## 👥 Agents Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/agents` | Create new agent profile |
| `GET` | `/agents` | Get all agents with filtering |
| `GET` | `/agents/:id` | Get agent by ID |
| `PATCH` | `/agents/:id` | Update agent information |
| `DELETE` | `/agents/:id` | Delete agent |

---

## 📁 File Management

### Core File Operations
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/files/upload` | Upload single file to S3 |
| `GET` | `/files/:id` | Get file information |
| `DELETE` | `/files/:id` | Delete file from S3 |
| `GET` | `/files/:id/download` | Download file from S3 |

### Document Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/masters/uploads` | Upload single document |
| `POST` | `/masters/uploads/multiple` | Upload multiple documents |
| `GET` | `/masters/uploads` | Get all uploaded documents |
| `GET` | `/masters/uploads/:id` | Get document by ID |
| `PATCH` | `/masters/uploads/:id` | Update document information |
| `DELETE` | `/masters/uploads/:id` | Soft delete document |
| `DELETE` | `/masters/uploads/:id/permanent` | Permanently delete document |
| `GET` | `/masters/uploads/:id/download` | Download document |
| `GET` | `/masters/uploads/statistics` | Get upload statistics |
| `GET` | `/masters/uploads/type/:uploadType` | Get documents by type |
| `GET` | `/masters/uploads/featured` | Get featured documents |

---

## 📊 Response Format

All API responses follow this standard format:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
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

## 🔒 Authentication Header

All endpoints (except `/auth/login`) require JWT authentication:

```http
Authorization: Bearer <your_jwt_token>
```

## 🚀 Getting Started

1. **Start the server**: `npm run dev`
2. **Access Swagger UI**: `http://localhost:3000/api/v1/docs`
3. **Login**: Use admin credentials to get JWT token
4. **Authorize**: Click "Authorize" in Swagger UI and paste your token
5. **Test**: Try any endpoint directly from the documentation

---

## 📈 Key Features

- ✅ **Complete CRUD Operations** for all modules
- ✅ **Advanced Search & Filtering** with multiple parameters
- ✅ **Pagination Support** for large datasets
- ✅ **File Upload Integration** with AWS S3
- ✅ **Real-time Statistics** and analytics
- ✅ **Comprehensive Validation** and error handling
- ✅ **Interactive API Documentation** with Swagger UI
- ✅ **Role-based Access Control** with JWT authentication
