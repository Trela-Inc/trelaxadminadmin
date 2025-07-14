/**
 * Master Types Enum
 * Defines all the different types of master data in the system
 */
export enum MasterType {
  CITY = 'city',
  LOCATION = 'location',
  AMENITY = 'amenity',
  FLOOR = 'floor',
  TOWER = 'tower',
  PROPERTY_TYPE = 'property_type',
  ROOM = 'room',
  WASHROOM = 'washroom',
}

/**
 * Master Status Enum
 * Defines the status of master data entries
 */
export enum MasterStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
}

/**
 * Amenity Categories Enum
 * Defines categories for amenities
 */
export enum AmenityCategory {
  BASIC = 'basic',
  RECREATIONAL = 'recreational',
  SECURITY = 'security',
  CONVENIENCE = 'convenience',
  WELLNESS = 'wellness',
  SPORTS = 'sports',
  COMMUNITY = 'community',
  PARKING = 'parking',
  UTILITIES = 'utilities',
}

/**
 * Property Type Categories Enum
 * Defines categories for property types
 */
export enum PropertyTypeCategory {
  RESIDENTIAL = 'residential',
  COMMERCIAL = 'commercial',
  MIXED_USE = 'mixed_use',
  INDUSTRIAL = 'industrial',
  AGRICULTURAL = 'agricultural',
  INSTITUTIONAL = 'institutional',
}

/**
 * Room Type Categories Enum
 * Defines categories for room configurations
 */
export enum RoomTypeCategory {
  STUDIO = 'studio',
  BHK = 'bhk',
  VILLA = 'villa',
  PENTHOUSE = 'penthouse',
  DUPLEX = 'duplex',
  TRIPLEX = 'triplex',
}
