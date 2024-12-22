import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/role.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ROLE } from 'src/common/enumerations/role.enum';
import { DebateRequestDto } from './dtos/debate-request.dto';
import { EvaluateRequestDto } from './dtos/evaluate-request.dto';
import { PracticeService } from './practice.service';
import { RolesGuard } from 'src/auth/guards/role.guard';

@Controller('practice')
@UseGuards(AuthGuard)
export class PracticeController {
  constructor(private practiceService: PracticeService) {}

  @Post('debate')
  async debateWithAI(
    @CurrentUser() userId: number,
    @Body() req: DebateRequestDto,
  ) {
    return this.practiceService.debateWithAI(req.content);
  }

  @Post('evaluate')
  async evaluate(
    @CurrentUser() userId: number,
    @Body() req: EvaluateRequestDto,
  ) {
    return this.practiceService.evaluteDebate(userId, req.essay);
  }

  @Get()
  @Roles(ROLE.ADMIN)
  @UseGuards(RolesGuard)
  async getResult() {
    return this.practiceService.getResultDebate();
  }

  @Get('/user')
  async getUserScore(@CurrentUser() userId: number) {
    return this.practiceService.getResultByUser(userId);
  }
}
