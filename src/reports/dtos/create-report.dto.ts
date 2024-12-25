import { ContentType } from '@prisma/client';
import { IsInt, IsString, IsIn } from 'class-validator';

export class CreateReportDto {
  @IsInt()
  contentId: number;

  @IsString()
  @IsIn(['FORUM', 'COMMENT'])
  contentType: ContentType;

  @IsString()
  reason: string;
}
