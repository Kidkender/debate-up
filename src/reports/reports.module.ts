import { Module } from '@nestjs/common';
import { ReportService } from './reports.service';
import { ReportController } from './reports.controller';

@Module({
  providers: [ReportService],
  controllers: [ReportController],
})
export class ReportsModule {}
