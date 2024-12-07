import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReportDto } from './dtos/create-report.dto';

@Injectable()
export class ReportService {
  private readonly logger = new Logger(ReportService.name);
  constructor(private readonly prisma: PrismaService) {}

  async createReport(userId: number, data: CreateReportDto) {
    const report = this.prisma.report.create({
      data: { ...data, userId: userId },
    });

    this.logger.log(`User ${userId} created report ${(await report).id}}`);
  }

  async getReports() {
    return this.prisma.report.findMany({
      include: {
        User: true,
      },
    });
  }
}
