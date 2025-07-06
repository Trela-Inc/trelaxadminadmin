import { ApiProperty } from '@nestjs/swagger';

export class CreateBuilderDto {
  @ApiProperty({ example: 'ABC Builders', description: 'Name of the builder' })
  name: string;
} 