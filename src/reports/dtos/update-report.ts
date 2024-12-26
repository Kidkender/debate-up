import { IsEnum, IsInt } from 'class-validator';
import { ReportStatus } from 'src/common/enumerations/ReportStatus.enum';

export class ResolveReportDto {
  @IsInt()
  reportId: number;

  @IsEnum(ReportStatus)
  status: ReportStatus;
}
