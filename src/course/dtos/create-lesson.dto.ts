import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateLessonDto {
  @IsNotEmpty()
  @IsNumber()
  courseId: number;

  @IsNotEmpty()
  title: string;

  @IsOptional()
  content: string;

  @IsNotEmpty()
  contentUrl: string;

  @IsNotEmpty()
  @IsNumber()
  order: number;
}
