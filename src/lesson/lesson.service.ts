import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLessonDto } from './dtos/create-lesson.dto';
import { UpdateLessonDto } from './dtos/update-lesson.dto';
import { Lesson } from '@prisma/client';
import { CourseService } from 'src/course/course.service';

@Injectable()
export class LessonService {
  private readonly logger = new Logger(LessonService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly courseService: CourseService,
  ) {}

  private async ensureLessonExists(id: number): Promise<void> {
    const exists = await this.prismaService.lesson.findUnique({
      where: { id },
    });
    if (!exists) {
      throw new NotFoundException(`Lesson ${id} not found`);
    }
  }

  async createLesson(data: CreateLessonDto) {
    await this.courseService.ensureCourseExists(data.courseId);

    const lesson = await this.prismaService.lesson.create({
      data: {
        title: data.title,
        courseId: data.courseId,
        content_url: data.contentUrl,
        content: data.content,
        order: data.order,
      },
    });

    this.logger.log(`Lesson ${lesson.id} created`);
  }

  async updateLesson(id: number, data: UpdateLessonDto) {
    await this.ensureLessonExists(id);

    const updatedLesson = await this.prismaService.lesson.update({
      where: { id },
      data,
    });

    this.logger.log(`Lesson ${id} updated`);
    return updatedLesson;
  }

  async deleteLesson(id: number) {
    await this.ensureLessonExists(id);

    await this.prismaService.lesson.delete({ where: { id } });
    this.logger.log(`Lesson ${id} deleted`);
  }

  async getLessons(): Promise<Lesson[]> {
    const lessons = await this.prismaService.lesson.findMany();
    return lessons;
  }

  async getLessonById(id: number): Promise<Lesson> {
    const lesson = await this.prismaService.lesson.findFirst({ where: { id } });
    return lesson;
  }
}
