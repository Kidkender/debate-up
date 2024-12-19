import { Module } from '@nestjs/common';
import { PracticeService } from './practice.service';
import { PracticeController } from './practice.controller';
import { HttpService } from 'src/common/http.service';

@Module({
  providers: [PracticeService, HttpService],
  controllers: [PracticeController],
})
export class PracticeModule {}
