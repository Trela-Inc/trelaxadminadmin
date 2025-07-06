import { ApiProperty } from '@nestjs/swagger';

export class CreateAmenityDto {
  @ApiProperty({ example: 'Swimming Pool', description: 'Name of the amenity' })
  name: string;
} 