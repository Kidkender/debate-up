import { IsOptional, IsString } from 'class-validator';

export class FilterResourceDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  category?: string;
}
