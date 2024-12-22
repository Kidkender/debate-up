import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PracticeService } from './practice.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { DebateRequestDto } from './dtos/debate-request.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { EvaluateRequestDto } from './dtos/evaluate-request.dto';
import { Roles } from 'src/auth/decorators/role.decorator';

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
  @Roles('admin')
  async getResult() {
    return this.practiceService.getResultDebate();
  }

  @Get('/user')
  async getUserScore(@CurrentUser() userId: number) {
    return this.practiceService.getResultByUser(userId);
  }
}
