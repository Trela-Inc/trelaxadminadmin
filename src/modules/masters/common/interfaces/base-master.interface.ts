import { Document, Types } from 'mongoose';
import { MasterStatus, MasterType } from '../enums/master-types.enum';

/**
 * Base Master Interface
 * Common fields that all master data types should have
 */
export interface BaseMaster {
  name: string;
  description?: string;
  code?: string;
  masterType: MasterType;
  status: MasterStatus;
  sortOrder?: number;
  isDefault?: boolean;
  isPopular?: boolean;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Base Master Document Interface
 * For Mongoose documents
 */
export interface BaseMasterDocument extends BaseMaster, Document {}

/**
 * Master with Parent Interface
 * For master data that has hierarchical relationships (like locations under cities)
 */
export interface MasterWithParent extends BaseMaster {
  parentId?: string;
  parentType?: MasterType;
}

/**
 * Master with Category Interface
 * For master data that has categories (like amenities)
 */
export interface MasterWithCategory extends BaseMaster {
  category?: string;
  icon?: string;
  color?: string;
}

/**
 * Master with Numeric Value Interface
 * For master data that has numeric values (like room counts, floor numbers)
 */
export interface MasterWithNumericValue extends BaseMaster {
  numericValue?: number;
  unit?: string;
  minValue?: number;
  maxValue?: number;
}

/**
 * Master with Location Interface
 * For master data that has geographical information (like cities)
 */
export interface MasterWithLocation extends BaseMaster {
  state?: string;
  country?: string;
  coordinates?: [number, number]; // [longitude, latitude]
  timezone?: string;
  pinCodes?: string[];
}

/**
 * Master Query Options Interface
 * Common query options for all master data types
 */
export interface MasterQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  status?: MasterStatus;
  isDefault?: boolean;
  isPopular?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  parentId?: string;
  category?: string;
}

/**
 * Master Response Interface
 * Common response structure for all master data types
 */
export interface MasterResponse<T = BaseMaster> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Master List Response Interface
 * Common response structure for list endpoints
 */
export interface MasterListResponse<T = BaseMaster> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

/**
 * Master Statistics Interface
 * For statistics endpoints
 */
export interface MasterStatistics {
  totalCount: number;
  activeCount: number;
  inactiveCount: number;
  popularCount: number;
  defaultCount: number;
  byCategory?: Record<string, number>;
  byStatus?: Record<string, number>;
}
