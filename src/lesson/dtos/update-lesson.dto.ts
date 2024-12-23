import { IsOptional, IsNumber, IsString } from 'class-validator';

export class UpdateLessonDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  content_url?: string;

  @IsOptional()
  @IsNumber()
  order?: number;
}
