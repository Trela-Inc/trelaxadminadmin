# 🚀 TrelaX Core Admin Backend - Quick Start Guide

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- AWS S3 bucket (for file uploads)

## ⚡ Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create `.env` file in root directory:
```env
# Server Configuration
PORT=3000
NODE_ENV=development
API_PREFIX=api/v1

# Database
MONGO_URI=mongodb://localhost:27017/trelax-admin

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-s3-bucket-name
```

### 3. Start the Server
```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run start:prod
```

## 🎯 Server Startup Messages

When you start the server, you'll see:

```
🎉 ===============================================
🚀 TrelaX Core Admin Backend Server Started!
===============================================
🌐 Server running at: http://localhost:3000
📡 API Base URL: http://localhost:3000/api/v1
📚 Swagger Docs: http://localhost:3000/api/v1/docs
🔧 Environment: development
📊 Port: 3000
===============================================

📋 AVAILABLE API ROUTES:
===============================================

🔐 AUTHENTICATION ROUTES:
POST   /api/v1/auth/login
GET    /api/v1/auth/profile
POST   /api/v1/auth/refresh

🏢 PROJECTS ROUTES:
POST   /api/v1/projects
GET    /api/v1/projects
GET    /api/v1/projects/:id
PATCH  /api/v1/projects/:id
DELETE /api/v1/projects/:id
POST   /api/v1/projects/:id/media
DELETE /api/v1/projects/:id/media/:mediaId
POST   /api/v1/projects/:id/documents
DELETE /api/v1/projects/:id/documents/:documentId
GET    /api/v1/projects/search/location
GET    /api/v1/projects/featured
GET    /api/v1/projects/statistics

🎛️ MASTERS ROUTES:
POST   /api/v1/masters
GET    /api/v1/masters
GET    /api/v1/masters/:id
PATCH  /api/v1/masters/:id
DELETE /api/v1/masters/:id
GET    /api/v1/masters/cities
GET    /api/v1/masters/locations/:cityId
GET    /api/v1/masters/amenities
GET    /api/v1/masters/bedrooms
GET    /api/v1/masters/bathrooms
GET    /api/v1/masters/statistics

📁 FILES ROUTES:
POST   /api/v1/files/upload
GET    /api/v1/files/:id
DELETE /api/v1/files/:id
GET    /api/v1/files/:id/download
GET    /api/v1/files/user/:userId

===============================================
🔑 DEFAULT ADMIN CREDENTIALS:
===============================================
Email: admin@trelax.com
Email: superadmin@trelax.com
Email: manager@trelax.com
Password: admin123 (for all accounts)
===============================================
```

## 🔐 Admin Authentication

### Default Admin Accounts
The system comes with 3 predefined admin accounts:

1. **admin@trelax.com** / admin123 (Admin role)
2. **superadmin@trelax.com** / admin123 (Super Admin role)
3. **manager@trelax.com** / admin123 (Admin role)

### Login Process
```bash
# Login to get JWT token
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@trelax.com",
    "password": "admin123"
  }'
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "admin1",
      "email": "admin@trelax.com",
      "firstName": "Admin",
      "lastName": "User",
      "role": "admin",
      "isActive": true
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

## 📚 API Documentation

### Interactive Swagger UI
Visit: `http://localhost:3000/api/v1/docs`

Features:
- Interactive API testing
- Request/response examples
- Authentication testing
- Schema documentation

### Postman Collection
Import the API routes into Postman:
1. Create new collection
2. Add base URL: `http://localhost:3000/api/v1`
3. Set Authorization: Bearer Token
4. Import routes from `API_ROUTES.md`

## 🏢 Quick API Testing

### 1. Login and Get Token
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@trelax.com", "password": "admin123"}'
```

### 2. Create a Project
```bash
curl -X POST http://localhost:3000/api/v1/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Test Project",
    "description": "A test real estate project",
    "builder": "Test Builder",
    "status": "Under Construction",
    "city": "Mumbai",
    "location": "Bandra West"
  }'
```

### 3. Get All Projects
```bash
curl -X GET http://localhost:3000/api/v1/projects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Get Master Data (Cities)
```bash
curl -X GET http://localhost:3000/api/v1/masters/cities \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🎛️ Master Data Management

The system includes pre-seeded master data:

### Cities
- Mumbai, Pune, Bangalore, Delhi, Gurgaon, Chennai, Hyderabad, Kolkata

### Amenities
- Swimming Pool, Gymnasium, Garden, Parking, Elevator
- CCTV Surveillance, 24/7 Security, Power Backup, etc.

### Bedrooms
- 1 BHK, 2 BHK, 3 BHK, 4 BHK, 5 BHK, 6+ BHK

### Bathrooms
- 1 Bathroom, 2 Bathrooms, 3 Bathrooms, 4 Bathrooms, 5+ Bathrooms

## 🔧 Development Commands

```bash
# Start development server
npm run start:dev

# Build for production
npm run build

# Start production server
npm run start:prod

# Run tests
npm run test

# Lint code
npm run lint

# Format code
npm run format
```

## 📊 Health Check

Check if server is running:
```bash
curl http://localhost:3000/api/v1/auth/login
```

If you get a response, the server is running correctly!

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check if MongoDB is running
   - Verify MONGO_URI in .env file

2. **JWT Token Issues**
   - Check JWT_SECRET in .env file
   - Ensure token is included in Authorization header

3. **File Upload Issues**
   - Verify AWS S3 credentials
   - Check bucket permissions

4. **Port Already in Use**
   - Change PORT in .env file
   - Kill existing process: `lsof -ti:3000 | xargs kill`

### Support
For issues or questions, check the API documentation at `/api/v1/docs` or review the route details in `API_ROUTES.md`.
