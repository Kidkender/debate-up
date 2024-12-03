import { ResourceType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateResourceDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsEnum(ResourceType, {
    message: 'Resource must be type VIDEO, ARTICLE OR BOOK',
  })
  type: ResourceType;
}
