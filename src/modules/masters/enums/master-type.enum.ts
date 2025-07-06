/**
 * Master field type enumeration
 * Defines different types of form fields that can be managed
 */
export enum MasterFieldType {
  CITY = 'city',
  LOCATION = 'location',
  AMENITY = 'amenity',
  BEDROOM = 'bedroom',
  BATHROOM = 'bathroom',
  PROJECT_STATUS = 'project_status',
  PROPERTY_TYPE = 'property_type',
  BUILDER_TYPE = 'builder_type',
  FACING_DIRECTION = 'facing_direction',
}

/**
 * Master data status enumeration
 */
export enum MasterStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}
