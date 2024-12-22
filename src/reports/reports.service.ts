import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReportDto } from './dtos/create-report.dto';
import { UserService } from 'src/user/user.service';
import { Report } from '@prisma/client';

@Injectable()
export class ReportService {
  private readonly logger = new Logger(ReportService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

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

  async getReportByUserId(userId: number): Promise<Report[]> {
    const user = await this.userService.getUserById(userId);

    const reports = await this.prisma.report.findMany({
      where: { userId: user.id },
    });
    return reports;
  }
}
