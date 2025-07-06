import { applyDecorators } from '@nestjs/common';
import { ApiResponse, ApiResponseOptions } from '@nestjs/swagger';

/**
 * Custom decorator for standardized API responses
 * Provides consistent response format across all endpoints
 */

// Standard success response decorator
export const ApiSuccessResponse = (options?: ApiResponseOptions) =>
  applyDecorators(
    ApiResponse({
      status: 200,
      description: 'Operation successful',
      ...options,
    }),
  );

// Standard created response decorator
export const ApiCreatedResponse = (options?: ApiResponseOptions) =>
  applyDecorators(
    ApiResponse({
      status: 201,
      description: 'Resource created successfully',
      ...options,
    }),
  );

// Standard bad request response decorator
export const ApiBadRequestResponse = (description?: string) =>
  applyDecorators(
    ApiResponse({
      status: 400,
      description: description || 'Bad request - Invalid input data',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 400 },
          message: { 
            oneOf: [
              { type: 'string' },
              { type: 'array', items: { type: 'string' } }
            ]
          },
          error: { type: 'string', example: 'Bad Request' },
        },
      },
    }),
  );

// Standard unauthorized response decorator
export const ApiUnauthorizedResponse = (description?: string) =>
  applyDecorators(
    ApiResponse({
      status: 401,
      description: description || 'Unauthorized - Invalid or missing authentication',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 401 },
          message: { type: 'string', example: 'Unauthorized' },
          error: { type: 'string', example: 'Unauthorized' },
        },
      },
    }),
  );

// Standard forbidden response decorator
export const ApiForbiddenResponse = (description?: string) =>
  applyDecorators(
    ApiResponse({
      status: 403,
      description: description || 'Forbidden - Insufficient permissions',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 403 },
          message: { type: 'string', example: 'Forbidden resource' },
          error: { type: 'string', example: 'Forbidden' },
        },
      },
    }),
  );

// Standard not found response decorator
export const ApiNotFoundResponse = (description?: string) =>
  applyDecorators(
    ApiResponse({
      status: 404,
      description: description || 'Resource not found',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 404 },
          message: { type: 'string', example: 'Resource not found' },
          error: { type: 'string', example: 'Not Found' },
        },
      },
    }),
  );

// Standard internal server error response decorator
export const ApiInternalServerErrorResponse = (description?: string) =>
  applyDecorators(
    ApiResponse({
      status: 500,
      description: description || 'Internal server error',
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: 500 },
          message: { type: 'string', example: 'Internal server error' },
          error: { type: 'string', example: 'Internal Server Error' },
        },
      },
    }),
  );
