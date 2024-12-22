import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from 'src/common/http.service';
import { EvaluateResponse } from './practice.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { DebateSession } from '@prisma/client';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PracticeService {
  private readonly logger = new Logger(PracticeService.name);

  constructor(
    private prismaService: PrismaService,
    private httpService: HttpService,
    private readonly userService: UserService,
  ) {
    this.httpService = new HttpService(process.env.AI_API_URL);
  }

  async debateWithAI(content: string) {
    const result: any = await this.httpService.post('/debate', {
      chat_history: [
        {
          role: 'Sinh viên',
          content: content,
        },
      ],
    });
    return result.ai_response;
  }

  async evaluteDebate(userId: number, essay: string) {
    const result: EvaluateResponse = await this.httpService.post('/evaluate', {
      essay,
    });
    const truncatedTopic = essay.substring(0, 255);
    const practiced = await this.prismaService.debateSession.create({
      data: {
        userId: userId,
        topic: truncatedTopic,
        aiResponse: result.improvements.toString(),
        userResponse: essay,
        feedback_score: result.total_score,
      },
    });

    this.logger.log(`User ${userId} has submit debate successfully`);
    return practiced.feedback_score;
  }
  async getResultDebate(): Promise<DebateSession[]> {
    return await this.prismaService.debateSession.findMany();
  }

  async getResultByUser(userId: number): Promise<DebateSession[]> {
    const user = await this.userService.getUserById(userId);

    const results = await this.prismaService.debateSession.findMany({
      where: { userId: user.id },
    });
    return results;
  }
}
