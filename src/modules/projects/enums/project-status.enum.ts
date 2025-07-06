/**
 * Project status enumeration
 * Defines different stages of real estate project development
 */
export enum ProjectStatus {
  PLANNED = 'planned',
  UNDER_CONSTRUCTION = 'under_construction',
  READY_TO_MOVE = 'ready_to_move',
  COMPLETED = 'completed',
  ON_HOLD = 'on_hold',
  CANCELLED = 'cancelled',
}

/**
 * Property type enumeration
 */
export enum PropertyType {
  RESIDENTIAL = 'residential',
  COMMERCIAL = 'commercial',
  MIXED_USE = 'mixed_use',
  INDUSTRIAL = 'industrial',
  AGRICULTURAL = 'agricultural',
}

/**
 * Unit type enumeration
 */
export enum UnitType {
  APARTMENT = 'apartment',
  VILLA = 'villa',
  PLOT = 'plot',
  OFFICE = 'office',
  SHOP = 'shop',
  WAREHOUSE = 'warehouse',
  STUDIO = 'studio',
  PENTHOUSE = 'penthouse',
}

/**
 * Facing direction enumeration
 */
export enum FacingDirection {
  NORTH = 'north',
  SOUTH = 'south',
  EAST = 'east',
  WEST = 'west',
  NORTH_EAST = 'north_east',
  NORTH_WEST = 'north_west',
  SOUTH_EAST = 'south_east',
  SOUTH_WEST = 'south_west',
}

/**
 * Possession status enumeration
 */
export enum PossessionStatus {
  IMMEDIATE = 'immediate',
  UNDER_CONSTRUCTION = 'under_construction',
  READY_BY_DATE = 'ready_by_date',
}

/**
 * Approval status enumeration
 */
export enum ApprovalStatus {
  APPROVED = 'approved',
  PENDING = 'pending',
  REJECTED = 'rejected',
  NOT_APPLICABLE = 'not_applicable',
}
