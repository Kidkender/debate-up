import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReportDto } from './dtos/create-report.dto';
import { UserService } from 'src/user/user.service';
import { Report, ReportStatus } from '@prisma/client';
import { ResolveReportDto } from './dtos/update-report';
import { DeleteContentDto } from './dtos/delete-content.dto';

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

    this.logger.log(`User ${userId} created report ${(await report).id}`);
  }

  async getReports() {
    const reports = await this.prisma.report.findMany({
      where: { status: ReportStatus.PENDING },
    });

    const enrichedReport = await Promise.all(
      reports.map(async (report) => {
        if (report.contentType === 'FORUM') {
          const post = await this.prisma.forum.findUnique({
            where: { id: report.contentId },
            select: { userId: true },
          });
          return { ...report, postOwner: post?.userId };
        } else if (report.contentType === 'COMMENT') {
          const comment = await this.prisma.forumComment.findUnique({
            where: { id: report.contentId },
            select: { userId: true },
          });
          return { ...report, commentOwner: comment?.userId };
        }
      }),
    );
    return enrichedReport;
  }

  async getReportById(reportId: number): Promise<Report> {
    const report = await this.prisma.report.findFirst({
      where: { id: reportId },
    });
    if (!report) {
      throw new BadRequestException(`Report ${reportId} not found`);
    }
    return report;
  }

  async getReportByUserId(userId: number): Promise<Report[]> {
    const user = await this.userService.getUserById(userId);

    const reports = await this.prisma.report.findMany({
      where: { userId: user.id },
    });
    return reports;
  }

  async resolveReport(data: ResolveReportDto) {
    const report = await this.getReportById(data.reportId);

    await this.prisma.report.update({
      where: { id: report.id },
      data: {
        status: data.status,
      },
    });

    this.logger.log(`Updated status report ${data.reportId} `);
  }

  async deleteReportedContent(data: DeleteContentDto) {
    const { contentType, contentId } = data;

    if (contentType === 'FORUM') {
      await this.prisma.forum.delete({ where: { id: contentId } });
    } else if (contentType === 'COMMENT') {
      await this.prisma.forumComment.delete({ where: { id: contentId } });
    } else {
      throw new NotFoundException('Invalid content type');
    }
  }
}
