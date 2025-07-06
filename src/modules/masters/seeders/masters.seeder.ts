import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MasterField, MasterFieldDocument } from '../schemas/master-field.schema';
import { MasterStatus, MasterFieldType } from '../enums/master-type.enum';

/**
 * Masters data seeder
 * Seeds initial master field data for form dropdowns
 */
@Injectable()
export class MastersSeeder {
  constructor(
    @InjectModel(MasterField.name) private masterFieldModel: Model<MasterFieldDocument>,
  ) {}

  /**
   * Seed all master field data
   */
  async seedAll(userId: string): Promise<void> {
    console.log('Starting master field seeding...');

    await this.seedCities(userId);
    await this.seedAmenities(userId);
    await this.seedBedrooms(userId);
    await this.seedBathrooms(userId);
    await this.seedProjectStatuses(userId);
    await this.seedPropertyTypes(userId);

    console.log('Master field seeding completed!');
  }

  /**
   * Seed cities data
   */
  async seedCities(userId: string): Promise<void> {
    const cities = [
      { name: 'Mumbai', sortOrder: 1, isDefault: true },
      { name: 'Pune', sortOrder: 2, isDefault: false },
      { name: 'Bangalore', sortOrder: 3, isDefault: false },
      { name: 'Delhi', sortOrder: 4, isDefault: false },
      { name: 'Gurgaon', sortOrder: 5, isDefault: false },
      { name: 'Chennai', sortOrder: 6, isDefault: false },
      { name: 'Hyderabad', sortOrder: 7, isDefault: false },
      { name: 'Kolkata', sortOrder: 8, isDefault: false },
    ];

    for (const cityData of cities) {
      const existingCity = await this.masterFieldModel.findOne({
        fieldType: MasterFieldType.CITY,
        name: cityData.name,
      });

      if (!existingCity) {
        await this.masterFieldModel.create({
          fieldType: MasterFieldType.CITY,
          name: cityData.name,
          description: `${cityData.name} city`,
          status: MasterStatus.ACTIVE,
          sortOrder: cityData.sortOrder,
          isDefault: cityData.isDefault,
          createdBy: userId,
        });
        console.log(`Created city: ${cityData.name}`);
      }
    }
  }

  /**
   * Seed amenities data
   */
  async seedAmenities(userId: string): Promise<void> {
    const amenities = [
      { name: 'Swimming Pool', sortOrder: 1, isDefault: true },
      { name: 'Gymnasium', sortOrder: 2, isDefault: true },
      { name: 'Garden', sortOrder: 3, isDefault: true },
      { name: 'Parking', sortOrder: 4, isDefault: true },
      { name: 'Elevator', sortOrder: 5, isDefault: true },
      { name: 'CCTV Surveillance', sortOrder: 6, isDefault: true },
      { name: '24/7 Security', sortOrder: 7, isDefault: true },
      { name: 'Club House', sortOrder: 8, isDefault: false },
      { name: 'Children Play Area', sortOrder: 9, isDefault: false },
      { name: 'Jogging Track', sortOrder: 10, isDefault: false },
      { name: 'Power Backup', sortOrder: 11, isDefault: true },
      { name: 'Water Supply', sortOrder: 12, isDefault: true },
      { name: 'Intercom', sortOrder: 13, isDefault: false },
      { name: 'Tennis Court', sortOrder: 14, isDefault: false },
      { name: 'Basketball Court', sortOrder: 15, isDefault: false },
    ];

    for (const amenityData of amenities) {
      const existingAmenity = await this.masterFieldModel.findOne({
        fieldType: MasterFieldType.AMENITY,
        name: amenityData.name,
      });

      if (!existingAmenity) {
        await this.masterFieldModel.create({
          fieldType: MasterFieldType.AMENITY,
          name: amenityData.name,
          description: `${amenityData.name} amenity`,
          status: MasterStatus.ACTIVE,
          sortOrder: amenityData.sortOrder,
          isDefault: amenityData.isDefault,
          createdBy: userId,
        });
        console.log(`Created amenity: ${amenityData.name}`);
      }
    }
  }

  /**
   * Seed bedrooms data
   */
  async seedBedrooms(userId: string): Promise<void> {
    const bedrooms = [
      { name: '1 BHK', value: '1', sortOrder: 1, isDefault: false },
      { name: '2 BHK', value: '2', sortOrder: 2, isDefault: true },
      { name: '3 BHK', value: '3', sortOrder: 3, isDefault: true },
      { name: '4 BHK', value: '4', sortOrder: 4, isDefault: false },
      { name: '5 BHK', value: '5', sortOrder: 5, isDefault: false },
      { name: '6+ BHK', value: '6', sortOrder: 6, isDefault: false },
    ];

    for (const bedroomData of bedrooms) {
      const existingBedroom = await this.masterFieldModel.findOne({
        fieldType: MasterFieldType.BEDROOM,
        name: bedroomData.name,
      });

      if (!existingBedroom) {
        await this.masterFieldModel.create({
          fieldType: MasterFieldType.BEDROOM,
          name: bedroomData.name,
          value: bedroomData.value,
          description: `${bedroomData.name} configuration`,
          status: MasterStatus.ACTIVE,
          sortOrder: bedroomData.sortOrder,
          isDefault: bedroomData.isDefault,
          createdBy: userId,
        });
        console.log(`Created bedroom: ${bedroomData.name}`);
      }
    }
  }

  /**
   * Seed bathrooms data
   */
  async seedBathrooms(userId: string): Promise<void> {
    const bathrooms = [
      { name: '1 Bathroom', value: '1', sortOrder: 1, isDefault: false },
      { name: '2 Bathrooms', value: '2', sortOrder: 2, isDefault: true },
      { name: '3 Bathrooms', value: '3', sortOrder: 3, isDefault: true },
      { name: '4 Bathrooms', value: '4', sortOrder: 4, isDefault: false },
      { name: '5+ Bathrooms', value: '5', sortOrder: 5, isDefault: false },
    ];

    for (const bathroomData of bathrooms) {
      const existingBathroom = await this.masterFieldModel.findOne({
        fieldType: MasterFieldType.BATHROOM,
        name: bathroomData.name,
      });

      if (!existingBathroom) {
        await this.masterFieldModel.create({
          fieldType: MasterFieldType.BATHROOM,
          name: bathroomData.name,
          value: bathroomData.value,
          description: `${bathroomData.name} configuration`,
          status: MasterStatus.ACTIVE,
          sortOrder: bathroomData.sortOrder,
          isDefault: bathroomData.isDefault,
          createdBy: userId,
        });
        console.log(`Created bathroom: ${bathroomData.name}`);
      }
    }
  }

  /**
   * Seed project statuses
   */
  async seedProjectStatuses(userId: string): Promise<void> {
    const statuses = [
      { name: 'Planned', sortOrder: 1, isDefault: false },
      { name: 'Under Construction', sortOrder: 2, isDefault: true },
      { name: 'Ready to Move', sortOrder: 3, isDefault: false },
      { name: 'Completed', sortOrder: 4, isDefault: false },
    ];

    for (const statusData of statuses) {
      const existingStatus = await this.masterFieldModel.findOne({
        fieldType: MasterFieldType.PROJECT_STATUS,
        name: statusData.name,
      });

      if (!existingStatus) {
        await this.masterFieldModel.create({
          fieldType: MasterFieldType.PROJECT_STATUS,
          name: statusData.name,
          description: `Project ${statusData.name.toLowerCase()}`,
          status: MasterStatus.ACTIVE,
          sortOrder: statusData.sortOrder,
          isDefault: statusData.isDefault,
          createdBy: userId,
        });
        console.log(`Created project status: ${statusData.name}`);
      }
    }
  }

  /**
   * Seed property types
   */
  async seedPropertyTypes(userId: string): Promise<void> {
    const types = [
      { name: 'Residential', sortOrder: 1, isDefault: true },
      { name: 'Commercial', sortOrder: 2, isDefault: false },
      { name: 'Mixed Use', sortOrder: 3, isDefault: false },
      { name: 'Industrial', sortOrder: 4, isDefault: false },
    ];

    for (const typeData of types) {
      const existingType = await this.masterFieldModel.findOne({
        fieldType: MasterFieldType.PROPERTY_TYPE,
        name: typeData.name,
      });

      if (!existingType) {
        await this.masterFieldModel.create({
          fieldType: MasterFieldType.PROPERTY_TYPE,
          name: typeData.name,
          description: `${typeData.name} property type`,
          status: MasterStatus.ACTIVE,
          sortOrder: typeData.sortOrder,
          isDefault: typeData.isDefault,
          createdBy: userId,
        });
        console.log(`Created property type: ${typeData.name}`);
      }
    }
  }
}
