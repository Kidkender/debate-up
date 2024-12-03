import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ResourceType } from '@prisma/client';

export class FilterResourceDto {
  @IsOptional()
  @IsString()
  categoryId?: number;

  @IsOptional()
  @IsEnum(ResourceType)
  type?: ResourceType;

  @IsOptional()
  @IsString()
  search?: string;
}
