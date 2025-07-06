import { ApiResponse, PaginatedResponse, ErrorResponse } from '../interfaces/api-response.interface';

/**
 * Utility class for creating standardized API responses
 * Ensures consistent response format across all endpoints
 */
export class ResponseUtil {
  /**
   * Create a successful response
   */
  static success<T>(data: T, message = 'Operation successful'): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Create a successful response without data
   */
  static successMessage(message = 'Operation successful'): ApiResponse {
    return {
      success: true,
      message,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Create an error response
   */
  static error(
    message: string,
    error?: string,
    statusCode = 500,
    path?: string,
  ): ErrorResponse {
    return {
      success: false,
      message,
      error: error || 'Internal Server Error',
      statusCode,
      timestamp: new Date().toISOString(),
      path,
    };
  }

  /**
   * Create a paginated response
   */
  static paginated<T>(
    data: T[],
    page: number,
    limit: number,
    total: number,
    message = 'Data retrieved successfully',
  ): PaginatedResponse<T> {
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      success: true,
      message,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev,
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Create a created response (201)
   */
  static created<T>(data: T, message = 'Resource created successfully'): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Create a not found response (404)
   */
  static notFound(message = 'Resource not found', path?: string): ErrorResponse {
    return this.error(message, 'Not Found', 404, path);
  }

  /**
   * Create a bad request response (400)
   */
  static badRequest(message = 'Bad request', path?: string): ErrorResponse {
    return this.error(message, 'Bad Request', 400, path);
  }

  /**
   * Create an unauthorized response (401)
   */
  static unauthorized(message = 'Unauthorized', path?: string): ErrorResponse {
    return this.error(message, 'Unauthorized', 401, path);
  }

  /**
   * Create a forbidden response (403)
   */
  static forbidden(message = 'Forbidden', path?: string): ErrorResponse {
    return this.error(message, 'Forbidden', 403, path);
  }
}
