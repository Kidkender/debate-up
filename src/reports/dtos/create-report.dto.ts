import { IsInt, IsString, IsIn } from 'class-validator';

export class CreateReportDto {
  @IsInt()
  contentId: number;

  @IsString()
  @IsIn(['POST', 'COMMENT'])
  contentType: 'POST' | 'COMMENT';

  @IsString()
  reason: string;
}
