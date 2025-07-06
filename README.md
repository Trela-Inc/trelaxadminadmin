# TrelaX Core Admin Backend

A complete NestJS monolith backend application with three main modules: Users, Files, and Real Estate Projects. Built with TypeScript, MongoDB, JWT authentication, and AWS S3 integration.

## Features

### 🔐 Authentication Module
- JWT-based authentication
- User registration and login
- Password hashing with bcrypt
- Protected routes with guards
- Refresh token support

### 👥 Users Module
- Complete user management (CRUD)
- Role-based access control
- User statistics and analytics
- Pagination and filtering
- Profile management

### 📁 Files Module
- File upload to AWS S3
- Multiple file upload support
- File metadata management
- Download URL generation
- File categorization and tagging
- File statistics

### 🏢 Real Estate Projects Module
- Complete project management system
- Project creation with detailed information:
  - Basic details (name, description, builder, status, location, RERA)
  - Property details (type, unit configurations, possession)
  - Amenities (basic, security, recreational, convenience, connectivity)
  - Media & Documents (images, videos, brochures, floor plans, documents)
- Advanced filtering and search
- Location-based search with geospatial queries
- Project statistics and analytics
- Featured projects management
- S3 integration for media and document uploads

### 🎛️ Masters Module
- **Simple CRUD for Form Fields**: Manage all dropdown options in one place
- **Cities**: Add, edit, delete cities for project location selection
- **Locations**: Manage locations within cities (hierarchical structure)
- **Amenities**: CRUD operations for project amenities
- **Bedrooms & Bathrooms**: Configure bedroom/bathroom options (1 BHK, 2 BHK, etc.)
- **Project Status**: Manage project status options (Planned, Under Construction, etc.)
- **Property Types**: Configure property types (Residential, Commercial, etc.)
- **Dynamic Dropdowns**: All form dropdowns populated from master data
- **Custom Sorting**: Define display order for better UX
- **Default Values**: Mark commonly used options as defaults

## Tech Stack

- **Framework**: NestJS with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with Passport
- **File Storage**: AWS S3
- **Validation**: class-validator & class-transformer
- **Documentation**: Swagger/OpenAPI
- **Environment**: dotenv configuration

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- AWS S3 bucket and credentials
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TrelaXCoreAdminBackend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Copy the `.env` file and update with your configurations:
   ```env
   # Database Configuration
   MONGO_URI=mongodb://localhost:27017/trelax_admin_db

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
   JWT_EXPIRES_IN=7d

   # AWS S3 Configuration
   AWS_ACCESS_KEY_ID=your_aws_access_key_id
   AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
   AWS_REGION=us-east-1
   AWS_S3_BUCKET=trelax-admin-uploads

   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # API Configuration
   API_PREFIX=api/v1
   ```

4. **Start the application**
   ```bash
   # Development mode
   npm run start:dev

   # Production mode
   npm run build
   npm run start:prod
   ```

## API Documentation

Once the application is running, you can access the Swagger documentation at:
```
http://localhost:3000/api/v1/docs
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/profile` - Get user profile
- `POST /api/v1/auth/refresh` - Refresh JWT token

### Users
- `GET /api/v1/users` - Get all users (with pagination & filtering)
- `GET /api/v1/users/:id` - Get user by ID
- `POST /api/v1/users` - Create new user
- `PATCH /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user (soft delete)
- `GET /api/v1/users/admin/statistics` - Get user statistics

### Files
- `POST /api/v1/files/upload` - Upload single file
- `POST /api/v1/files/upload/multiple` - Upload multiple files
- `GET /api/v1/files` - Get all files (with pagination & filtering)
- `GET /api/v1/files/:id` - Get file by ID
- `GET /api/v1/files/:id/download` - Get download URL
- `DELETE /api/v1/files/:id` - Delete file
- `GET /api/v1/files/admin/statistics` - Get file statistics

### Projects
- `POST /api/v1/projects` - Create new project
- `GET /api/v1/projects` - Get all projects (with advanced filtering)
- `GET /api/v1/projects/:id` - Get project by ID
- `PATCH /api/v1/projects/:id` - Update project
- `DELETE /api/v1/projects/:id` - Delete project (soft delete)
- `POST /api/v1/projects/:id/media/:type` - Upload project media
- `POST /api/v1/projects/:id/documents/:type` - Upload project documents
- `GET /api/v1/projects/featured` - Get featured projects
- `GET /api/v1/projects/admin/statistics` - Get project statistics

### Masters
- `POST /api/v1/masters` - Create new master field
- `GET /api/v1/masters` - Get all master fields (with filtering)
- `GET /api/v1/masters/:id` - Get master field by ID
- `PATCH /api/v1/masters/:id` - Update master field
- `DELETE /api/v1/masters/:id` - Delete master field
- `GET /api/v1/masters/cities` - Get cities for dropdown
- `GET /api/v1/masters/locations/:cityId` - Get locations by city
- `GET /api/v1/masters/amenities` - Get amenities for dropdown
- `GET /api/v1/masters/bedrooms` - Get bedroom options
- `GET /api/v1/masters/bathrooms` - Get bathroom options
- `GET /api/v1/masters/statistics` - Get master data statistics

## Project Structure

```
src/
├── common/                 # Shared utilities and decorators
│   ├── decorators/        # Custom decorators
│   ├── interfaces/        # Common interfaces
│   └── utils/            # Utility functions
├── modules/
│   ├── auth/             # Authentication module
│   │   ├── dto/          # Data Transfer Objects
│   │   ├── guards/       # Auth guards
│   │   └── strategies/   # Passport strategies
│   ├── users/            # Users module
│   │   ├── dto/          # User DTOs
│   │   ├── enums/        # User enums
│   │   └── schemas/      # User schema
│   ├── files/            # Files module
│   │   ├── dto/          # File DTOs
│   │   ├── schemas/      # File schema
│   │   └── services/     # S3 service
│   ├── projects/         # Projects module
│   │   ├── dto/          # Project DTOs
│   │   ├── enums/        # Project enums
│   │   └── schemas/      # Project schema
│   └── masters/          # Masters module
│       ├── dto/          # Master data DTOs
│       ├── enums/        # Master data enums
│       └── schemas/      # Master data schemas
├── app.module.ts         # Root module
├── app.controller.ts     # Root controller
├── app.service.ts        # Root service
└── main.ts              # Application entry point
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `JWT_EXPIRES_IN` | JWT token expiration time | No (default: 7d) |
| `AWS_ACCESS_KEY_ID` | AWS access key | Yes |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | Yes |
| `AWS_REGION` | AWS region | Yes |
| `AWS_S3_BUCKET` | S3 bucket name | Yes |
| `PORT` | Server port | No (default: 3000) |
| `NODE_ENV` | Environment mode | No (default: development) |
| `API_PREFIX` | API route prefix | No (default: api/v1) |

## Development

```bash
# Start in development mode with hot reload
npm run start:dev

# Run tests
npm run test

# Run tests with coverage
npm run test:cov

# Lint code
npm run lint

# Format code
npm run format
```

## Production Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm run start:prod
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
