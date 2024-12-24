import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonController } from './lesson.controller';
import { CourseModule } from 'src/course/course.module';

@Module({
  imports: [CourseModule],
  providers: [LessonService],
  controllers: [LessonController],
})
export class LessonModule {}
