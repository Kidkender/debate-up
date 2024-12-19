import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PracticeService } from './practice.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { DebateRequestDto } from './dtos/debate-request.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { EvaluateRequestDto } from './dtos/evaluate-request.dto';

@Controller('practice')
export class PracticeController {
  constructor(private practiceService: PracticeService) {}

  @Post('debate')
  @UseGuards(AuthGuard)
  async debateWithAI(@Body() req: DebateRequestDto) {
    return this.practiceService.debateWithAI(req.content);
  }

  @Post('evaluate')
  @UseGuards(AuthGuard)
  async evaluate(
    @CurrentUser() userId: number,
    @Body() req: EvaluateRequestDto,
  ) {
    return this.practiceService.evaluteDebate(userId, req.essay);
  }
}
