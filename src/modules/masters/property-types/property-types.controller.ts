import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  UseGuards,
  ValidationPipe
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiBody
} from '@nestjs/swagger';
import { PropertyTypesService } from './property-types.service';
import { CreatePropertyTypeDto } from './dto/create-property-type.dto';
import { UpdatePropertyTypeDto } from './dto/update-property-type.dto';
import { QueryMasterWithCategoryDto } from '../common/dto/query-master.dto';
import { PropertyTypeCategory } from '../common/enums/master-types.enum';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Masters - Property Types')
@Controller('masters/property-types')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PropertyTypesController {
  constructor(private readonly propertyTypesService: PropertyTypesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new property type' })
  @ApiBody({ type: CreatePropertyTypeDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Property type created successfully' })
  async create(@Body(ValidationPipe) createPropertyTypeDto: CreatePropertyTypeDto) {
    const propertyType = await this.propertyTypesService.createPropertyType(createPropertyTypeDto);
    return {
      success: true,
      data: propertyType,
      message: 'Property type created successfully'
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all property types' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Property types retrieved successfully' })
  async findAll(@Query(ValidationPipe) queryDto: QueryMasterWithCategoryDto) {
    return await this.propertyTypesService.findAllPropertyTypes(queryDto);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get property type statistics' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Property type statistics retrieved successfully' })
  async getStatistics() {
    const statistics = await this.propertyTypesService.getPropertyTypeStatistics();
    return {
      success: true,
      data: statistics,
      message: 'Property type statistics retrieved successfully'
    };
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get property types by category' })
  @ApiParam({ name: 'category', enum: PropertyTypeCategory, example: PropertyTypeCategory.RESIDENTIAL })
  @ApiResponse({ status: HttpStatus.OK, description: 'Property types retrieved successfully' })
  async findByCategory(@Param('category') category: PropertyTypeCategory) {
    const propertyTypes = await this.propertyTypesService.findPropertyTypesByCategory(category);
    return {
      success: true,
      data: propertyTypes,
      message: `${category} property types retrieved successfully`
    };
  }

  @Get('residential')
  @ApiOperation({ summary: 'Get residential property types' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Residential property types retrieved successfully' })
  async findResidential() {
    const propertyTypes = await this.propertyTypesService.findResidentialPropertyTypes();
    return {
      success: true,
      data: propertyTypes,
      message: 'Residential property types retrieved successfully'
    };
  }

  @Get('commercial')
  @ApiOperation({ summary: 'Get commercial property types' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Commercial property types retrieved successfully' })
  async findCommercial() {
    const propertyTypes = await this.propertyTypesService.findCommercialPropertyTypes();
    return {
      success: true,
      data: propertyTypes,
      message: 'Commercial property types retrieved successfully'
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get property type by ID' })
  @ApiParam({ name: 'id', description: 'Property type ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Property type retrieved successfully' })
  async findOne(@Param('id') id: string) {
    const propertyType = await this.propertyTypesService.findPropertyTypeById(id);
    return {
      success: true,
      data: propertyType,
      message: 'Property type retrieved successfully'
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update property type by ID' })
  @ApiParam({ name: 'id', description: 'Property type ID' })
  @ApiBody({ type: UpdatePropertyTypeDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Property type updated successfully' })
  async update(@Param('id') id: string, @Body(ValidationPipe) updatePropertyTypeDto: UpdatePropertyTypeDto) {
    const propertyType = await this.propertyTypesService.updatePropertyType(id, updatePropertyTypeDto);
    return {
      success: true,
      data: propertyType,
      message: 'Property type updated successfully'
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete property type by ID' })
  @ApiParam({ name: 'id', description: 'Property type ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Property type deleted successfully' })
  async remove(@Param('id') id: string) {
    await this.propertyTypesService.removePropertyType(id);
    return {
      success: true,
      message: 'Property type deleted successfully'
    };
  }
}
