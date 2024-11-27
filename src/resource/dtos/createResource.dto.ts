import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateResourceDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString()
  url: string;

  @IsNotEmpty()
  @IsString()
  category: string;
}
