import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportService } from './reports.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createReport(
    @CurrentUser() userId: number,
    @Body() createReportDto: CreateReportDto,
  ) {
    return this.reportService.createReport(userId, createReportDto);
  }

  @Get()
  async getAllReports() {
    return this.reportService.getReports();
  }
}
