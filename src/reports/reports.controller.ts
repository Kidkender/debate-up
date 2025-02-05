import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/role.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { ROLE } from 'src/common/enumerations/role.enum';
import { CreateReportDto } from './dtos/create-report.dto';
import { ResolveReportDto } from './dtos/update-report';
import { ReportService } from './reports.service';
import { DeleteContentDto } from './dtos/delete-content.dto';

@ApiTags('Reports')
@UseGuards(AuthGuard)
@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  async createReport(
    @CurrentUser() userId: number,
    @Body() createReportDto: CreateReportDto,
  ) {
    return this.reportService.createReport(userId, createReportDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(ROLE.ADMIN)
  async getAllReports() {
    return this.reportService.getReports();
  }

  @Get('my-report')
  async getUserReports(@CurrentUser() userId: number) {
    return this.reportService.getReportByUserId(userId);
  }

  @Patch('resolve')
  @Roles(ROLE.ADMIN)
  @UseGuards(RolesGuard)
  async resolveReport(@Body() resolveReportDto: ResolveReportDto) {
    return this.reportService.resolveReport(resolveReportDto);
  }

  @Post('delete-content')
  @Roles(ROLE.ADMIN)
  @UseGuards(RolesGuard)
  deleteReportedContent(@Body() data: DeleteContentDto) {
    return this.reportService.deleteReportedContent(data);
  }
}
