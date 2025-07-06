import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsNumber,
  IsArray,
  IsBoolean,
  IsDateString,
  ValidateNested,
  Min,
  Max,
  MaxLength,
  IsEmail,
  IsUrl,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ProjectStatus,
  PropertyType,
  UnitType,
  FacingDirection,
  PossessionStatus,
  ApprovalStatus,
} from '../enums/project-status.enum';

/**
 * Location DTO
 */
export class LocationDto {
  @ApiProperty({ description: 'Full address', example: '123 Main Street, Downtown' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ description: 'City name', example: 'Mumbai' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ description: 'State name', example: 'Maharashtra' })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ description: 'Country name', example: 'India' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ description: 'Postal/ZIP code', example: '400001' })
  @IsString()
  @IsNotEmpty()
  pincode: string;

  @ApiPropertyOptional({ description: 'Nearby landmark', example: 'Near Central Mall' })
  @IsOptional()
  @IsString()
  landmark?: string;

  @ApiPropertyOptional({
    description: 'GPS coordinates [longitude, latitude]',
    example: [72.8777, 19.0760],
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  coordinates?: [number, number];
}

/**
 * Builder DTO
 */
export class BuilderDto {
  @ApiProperty({ description: 'Builder name', example: 'ABC Constructions' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Builder description', example: 'Leading real estate developer' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({ description: 'Builder website', example: 'https://abcconstructions.com' })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({ description: 'Contact email', example: 'info@abcconstructions.com' })
  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @ApiPropertyOptional({ description: 'Contact phone', example: '+91-9876543210' })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiPropertyOptional({ description: 'Builder logo URL', example: 'https://s3.amazonaws.com/bucket/logo.jpg' })
  @IsOptional()
  @IsString()
  logo?: string;
}

/**
 * Unit Configuration DTO
 */
export class UnitConfigurationDto {
  @ApiProperty({ description: 'Unit type', enum: UnitType, example: UnitType.APARTMENT })
  @IsEnum(UnitType)
  type: UnitType;

  @ApiProperty({ description: 'Unit name/configuration', example: '2 BHK' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Number of bedrooms', example: 2, minimum: 0 })
  @IsNumber()
  @Min(0)
  bedrooms: number;

  @ApiProperty({ description: 'Number of bathrooms', example: 2, minimum: 0 })
  @IsNumber()
  @Min(0)
  bathrooms: number;

  @ApiPropertyOptional({ description: 'Number of balconies', example: 1, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  balconies?: number;

  @ApiProperty({ description: 'Carpet area in sq ft', example: 850, minimum: 0 })
  @IsNumber()
  @Min(0)
  carpetArea: number;

  @ApiPropertyOptional({ description: 'Built-up area in sq ft', example: 1000, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  builtUpArea?: number;

  @ApiPropertyOptional({ description: 'Super built-up area in sq ft', example: 1200, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  superBuiltUpArea?: number;

  @ApiProperty({ description: 'Minimum price', example: 5000000, minimum: 0 })
  @IsNumber()
  @Min(0)
  priceMin: number;

  @ApiProperty({ description: 'Maximum price', example: 7000000, minimum: 0 })
  @IsNumber()
  @Min(0)
  priceMax: number;

  @ApiPropertyOptional({ description: 'Total units of this configuration', example: 50, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalUnits?: number;

  @ApiPropertyOptional({ description: 'Available units', example: 25, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  availableUnits?: number;

  @ApiPropertyOptional({
    description: 'Facing directions',
    enum: FacingDirection,
    isArray: true,
    example: [FacingDirection.NORTH, FacingDirection.EAST],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(FacingDirection, { each: true })
  facing?: FacingDirection[];

  @ApiPropertyOptional({
    description: 'Floor plan image URLs',
    type: [String],
    example: ['https://s3.amazonaws.com/bucket/floorplan1.jpg'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  floorPlans?: string[];
}

/**
 * Amenities DTO
 */
export class AmenitiesDto {
  @ApiPropertyOptional({
    description: 'Basic amenities',
    type: [String],
    example: ['Swimming Pool', 'Gym', 'Garden'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  basic?: string[];

  @ApiPropertyOptional({
    description: 'Security amenities',
    type: [String],
    example: ['CCTV', '24/7 Security', 'Intercom'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  security?: string[];

  @ApiPropertyOptional({
    description: 'Recreational amenities',
    type: [String],
    example: ['Club House', 'Children Play Area', 'Jogging Track'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  recreational?: string[];

  @ApiPropertyOptional({
    description: 'Convenience amenities',
    type: [String],
    example: ['Parking', 'Lift', 'Power Backup'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  convenience?: string[];

  @ApiPropertyOptional({
    description: 'Connectivity amenities',
    type: [String],
    example: ['Metro Station', 'Bus Stop', 'Highway Access'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  connectivity?: string[];
}

/**
 * Media DTO
 */
export class MediaDto {
  @ApiPropertyOptional({
    description: 'Project image URLs',
    type: [String],
    example: ['https://s3.amazonaws.com/bucket/image1.jpg'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({
    description: 'Project video URLs',
    type: [String],
    example: ['https://s3.amazonaws.com/bucket/video1.mp4'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  videos?: string[];

  @ApiPropertyOptional({
    description: 'Brochure URLs',
    type: [String],
    example: ['https://s3.amazonaws.com/bucket/brochure.pdf'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  brochures?: string[];

  @ApiPropertyOptional({
    description: 'Floor plan URLs',
    type: [String],
    example: ['https://s3.amazonaws.com/bucket/floorplan.jpg'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  floorPlans?: string[];

  @ApiPropertyOptional({
    description: 'Master plan URLs',
    type: [String],
    example: ['https://s3.amazonaws.com/bucket/masterplan.jpg'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  masterPlan?: string[];

  @ApiPropertyOptional({
    description: 'Location map URLs',
    type: [String],
    example: ['https://s3.amazonaws.com/bucket/locationmap.jpg'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  locationMap?: string[];
}

/**
 * Documents DTO
 */
export class DocumentsDto {
  @ApiPropertyOptional({
    description: 'Approval document URLs',
    type: [String],
    example: ['https://s3.amazonaws.com/bucket/approval.pdf'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  approvals?: string[];

  @ApiPropertyOptional({
    description: 'Legal document URLs',
    type: [String],
    example: ['https://s3.amazonaws.com/bucket/legal.pdf'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  legalDocuments?: string[];

  @ApiPropertyOptional({
    description: 'Certificate URLs',
    type: [String],
    example: ['https://s3.amazonaws.com/bucket/certificate.pdf'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  certificates?: string[];

  @ApiPropertyOptional({
    description: 'Other document URLs',
    type: [String],
    example: ['https://s3.amazonaws.com/bucket/other.pdf'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  others?: string[];
}

/**
 * Main Create Project DTO
 */
export class CreateProjectDto {
  // Basic Details
  @ApiProperty({ description: 'Project name', example: 'Luxury Heights Residency' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  projectName: string;

  @ApiProperty({ description: 'Project description', example: 'Premium residential project with modern amenities' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  projectDescription: string;

  @ApiProperty({ description: 'Builder information', type: BuilderDto })
  @ValidateNested()
  @Type(() => BuilderDto)
  builder: BuilderDto;

  @ApiProperty({ description: 'Project status', enum: ProjectStatus, example: ProjectStatus.PLANNED })
  @IsEnum(ProjectStatus)
  projectStatus: ProjectStatus;

  @ApiProperty({ description: 'Project location', type: LocationDto })
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @ApiPropertyOptional({ description: 'RERA registration number', example: 'RERA123456789' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  reraNumber?: string;

  // Property Details
  @ApiProperty({ description: 'Property type', enum: PropertyType, example: PropertyType.RESIDENTIAL })
  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @ApiProperty({
    description: 'Unit configurations',
    type: [UnitConfigurationDto],
    example: [
      {
        type: 'apartment',
        name: '2 BHK',
        bedrooms: 2,
        bathrooms: 2,
        carpetArea: 850,
        priceMin: 5000000,
        priceMax: 7000000,
      },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => UnitConfigurationDto)
  unitConfigurations: UnitConfigurationDto[];

  @ApiPropertyOptional({ description: 'Possession status', enum: PossessionStatus })
  @IsOptional()
  @IsEnum(PossessionStatus)
  possessionStatus?: PossessionStatus;

  @ApiPropertyOptional({ description: 'Expected possession date', example: '2025-12-31' })
  @IsOptional()
  @IsDateString()
  possessionDate?: string;

  @ApiPropertyOptional({ description: 'Total project area in sq ft', example: 50000, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalArea?: number;

  @ApiPropertyOptional({ description: 'Total number of units', example: 200, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalUnits?: number;

  @ApiPropertyOptional({ description: 'Total number of floors', example: 25, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalFloors?: number;

  @ApiPropertyOptional({ description: 'Total number of towers', example: 3, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalTowers?: number;

  // Pricing
  @ApiPropertyOptional({ description: 'Minimum price across all units', example: 3000000, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  priceMin?: number;

  @ApiPropertyOptional({ description: 'Maximum price across all units', example: 15000000, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  priceMax?: number;

  @ApiPropertyOptional({ description: 'Average price per sq ft', example: 8000, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  pricePerSqFt?: number;

  // Amenities
  @ApiPropertyOptional({ description: 'Project amenities', type: AmenitiesDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => AmenitiesDto)
  amenities?: AmenitiesDto;

  // Media & Documents
  @ApiPropertyOptional({ description: 'Project media files', type: MediaDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => MediaDto)
  media?: MediaDto;

  @ApiPropertyOptional({ description: 'Project documents', type: DocumentsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => DocumentsDto)
  documents?: DocumentsDto;

  // Additional Information
  @ApiPropertyOptional({
    description: 'Project tags for categorization',
    type: [String],
    example: ['luxury', 'gated-community', 'eco-friendly'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Project highlights',
    example: 'Prime location with excellent connectivity and world-class amenities',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  highlights?: string;

  @ApiPropertyOptional({ description: 'Approval status', enum: ApprovalStatus })
  @IsOptional()
  @IsEnum(ApprovalStatus)
  approvalStatus?: ApprovalStatus;

  @ApiPropertyOptional({
    description: 'Nearby facilities',
    type: [String],
    example: ['Metro Station - 500m', 'Shopping Mall - 1km', 'Hospital - 2km'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  nearbyFacilities?: string[];

  @ApiPropertyOptional({ description: 'Whether project is featured', example: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}
