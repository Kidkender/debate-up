import { IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { ResourceType } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterResourceDto {
  @ApiPropertyOptional()
  @IsOptional()
  categoryId?: number;

  @ApiPropertyOptional({ enum: ResourceType })
  @IsOptional()
  @IsEnum(ResourceType)
  type?: ResourceType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;
}
