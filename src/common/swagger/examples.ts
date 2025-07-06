/**
 * Swagger API Examples
 * Comprehensive examples for all API endpoints
 */

export const SwaggerExamples = {
  // Authentication Examples
  auth: {
    loginRequest: {
      email: 'admin@trelax.com',
      password: 'admin123'
    },
    loginResponse: {
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: 'admin1',
          email: 'admin@trelax.com',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
          isActive: true
        },
        tokens: {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbjEiLCJlbWFpbCI6ImFkbWluQHRyZWxheC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2NDA5OTUyMDAsImV4cCI6MTY0MTA4MTYwMH0.example'
        }
      },
      timestamp: '2024-01-01T00:00:00.000Z'
    },
    profileResponse: {
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        id: 'admin1',
        email: 'admin@trelax.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        isActive: true
      },
      timestamp: '2024-01-01T00:00:00.000Z'
    }
  },

  // Project Examples
  projects: {
    createRequest: {
      projectName: 'Luxury Apartments Mumbai',
      projectDescription: 'Premium residential project with world-class amenities',
      builder: {
        name: 'ABC Builders',
        description: 'Leading real estate developer',
        website: 'https://abcbuilders.com',
        email: 'info@abcbuilders.com',
        phone: '+91-22-1234-5678'
      },
      projectStatus: 'under_construction',
      location: {
        address: '123 Main Street, Bandra West',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        pincode: '400050',
        landmark: 'Near Bandra Station',
        coordinates: [72.8777, 19.0760]
      },
      reraNumber: 'P51800000001',
      propertyType: 'residential',
      unitConfigurations: [
        {
          type: 'apartment',
          name: '2 BHK',
          bedrooms: 2,
          bathrooms: 2,
          area: 1200,
          priceRange: {
            min: 8000000,
            max: 12000000
          },
          totalUnits: 50,
          availableUnits: 30,
          facing: ['north', 'east']
        }
      ],
      amenities: {
        basic: ['Swimming Pool', 'Gymnasium', 'Garden'],
        security: ['CCTV Surveillance', '24/7 Security'],
        recreational: ['Club House', 'Children Play Area']
      },
      isFeatured: true,
      isActive: true
    },
    listResponse: {
      success: true,
      message: 'Projects retrieved successfully',
      data: [
        {
          id: '507f1f77bcf86cd799439011',
          projectName: 'Luxury Apartments Mumbai',
          projectDescription: 'Premium residential project',
          builder: {
            name: 'ABC Builders'
          },
          projectStatus: 'under_construction',
          location: {
            city: 'Mumbai',
            state: 'Maharashtra'
          },
          propertyType: 'residential',
          isFeatured: true,
          createdAt: '2024-01-01T00:00:00.000Z'
        }
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
      },
      timestamp: '2024-01-01T00:00:00.000Z'
    }
  },

  // Masters Examples
  masters: {
    createRequest: {
      fieldType: 'city',
      name: 'Nashik',
      description: 'Wine capital of India',
      status: 'active',
      sortOrder: 9,
      isDefault: false
    },
    createLocationRequest: {
      fieldType: 'location',
      name: 'Bandra West',
      description: 'Premium locality in Mumbai',
      parentId: '507f1f77bcf86cd799439011',
      status: 'active',
      sortOrder: 1,
      isDefault: false
    },
    createAmenityRequest: {
      fieldType: 'amenity',
      name: 'Rooftop Garden',
      description: 'Beautiful rooftop garden with city views',
      status: 'active',
      sortOrder: 16,
      isDefault: false
    },
    listResponse: {
      success: true,
      message: 'Master fields retrieved successfully',
      data: [
        {
          id: '507f1f77bcf86cd799439011',
          fieldType: 'city',
          name: 'Mumbai',
          description: 'Financial capital of India',
          status: 'active',
          sortOrder: 1,
          isDefault: true,
          createdAt: '2024-01-01T00:00:00.000Z'
        }
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
      },
      timestamp: '2024-01-01T00:00:00.000Z'
    },
    dropdownResponse: {
      success: true,
      message: 'Cities retrieved successfully',
      data: [
        {
          id: '507f1f77bcf86cd799439011',
          fieldType: 'city',
          name: 'Mumbai',
          sortOrder: 1,
          isDefault: true
        },
        {
          id: '507f1f77bcf86cd799439012',
          fieldType: 'city',
          name: 'Pune',
          sortOrder: 2,
          isDefault: false
        }
      ],
      timestamp: '2024-01-01T00:00:00.000Z'
    }
  },

  // Files Examples
  files: {
    uploadResponse: {
      success: true,
      message: 'File uploaded successfully',
      data: {
        id: '507f1f77bcf86cd799439011',
        originalName: 'project-image.jpg',
        fileName: 'uploads/projects/1640995200000-project-image.jpg',
        mimeType: 'image/jpeg',
        size: 1024000,
        category: 'project_media',
        s3Key: 'uploads/projects/1640995200000-project-image.jpg',
        s3Url: 'https://your-bucket.s3.amazonaws.com/uploads/projects/1640995200000-project-image.jpg',
        uploadedBy: 'admin1',
        createdAt: '2024-01-01T00:00:00.000Z'
      },
      timestamp: '2024-01-01T00:00:00.000Z'
    },
    listResponse: {
      success: true,
      message: 'Files retrieved successfully',
      data: [
        {
          id: '507f1f77bcf86cd799439011',
          originalName: 'project-image.jpg',
          fileName: 'uploads/projects/1640995200000-project-image.jpg',
          mimeType: 'image/jpeg',
          size: 1024000,
          category: 'project_media',
          s3Url: 'https://your-bucket.s3.amazonaws.com/uploads/projects/1640995200000-project-image.jpg',
          createdAt: '2024-01-01T00:00:00.000Z'
        }
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
      },
      timestamp: '2024-01-01T00:00:00.000Z'
    }
  },

  // Error Examples
  errors: {
    unauthorized: {
      success: false,
      message: 'Unauthorized access',
      error: 'Invalid or missing JWT token',
      timestamp: '2024-01-01T00:00:00.000Z'
    },
    badRequest: {
      success: false,
      message: 'Validation failed',
      error: 'Invalid input data provided',
      timestamp: '2024-01-01T00:00:00.000Z'
    },
    notFound: {
      success: false,
      message: 'Resource not found',
      error: 'The requested resource does not exist',
      timestamp: '2024-01-01T00:00:00.000Z'
    }
  }
};

export const SwaggerSchemas = {
  StandardResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      message: { type: 'string' },
      data: { type: 'object' },
      timestamp: { type: 'string', format: 'date-time' }
    }
  },
  PaginatedResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      message: { type: 'string' },
      data: { type: 'array', items: { type: 'object' } },
      pagination: {
        type: 'object',
        properties: {
          page: { type: 'number' },
          limit: { type: 'number' },
          total: { type: 'number' },
          totalPages: { type: 'number' },
          hasNext: { type: 'boolean' },
          hasPrev: { type: 'boolean' }
        }
      },
      timestamp: { type: 'string', format: 'date-time' }
    }
  },
  ErrorResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: false },
      message: { type: 'string' },
      error: { type: 'string' },
      timestamp: { type: 'string', format: 'date-time' }
    }
  }
};
