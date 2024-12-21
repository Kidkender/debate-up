import { ApiProperty } from '@nestjs/swagger';
import { CourseLevel } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: CourseLevel, enumName: 'CourseLevel', required: true })
  @IsEnum(CourseLevel)
  level: CourseLevel;

  @Min(1)
  @IsNumber()
  duration: number;
}
