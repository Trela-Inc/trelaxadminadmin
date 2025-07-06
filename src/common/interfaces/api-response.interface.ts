/**
 * Standard API response interfaces for consistent response format
 */

// Base API response interface
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

// Paginated response interface
export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Error response interface
export interface ErrorResponse {
  success: false;
  message: string;
  error: string;
  statusCode: number;
  timestamp: string;
  path?: string;
}

// File upload response interface
export interface FileUploadResponse {
  success: boolean;
  message: string;
  data: {
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
    url: string;
    key: string;
  };
  timestamp: string;
}

// Authentication response interface
export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
    };
    tokens: {
      accessToken: string;
      refreshToken?: string;
    };
  };
  timestamp: string;
}
