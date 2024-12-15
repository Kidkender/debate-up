import { ApiProperty } from '@nestjs/swagger';
import { CourseLevel } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
}
