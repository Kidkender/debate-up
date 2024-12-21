import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Course } from '@prisma/client';
import { CourseLevel } from 'src/common/enumerations/courseLevel.enum';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto } from './dtos/create-course.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';
import { CreateLessonDto } from './dtos/create-lesson.dto';

@Injectable()
export class CourseService {
  private readonly logger = new Logger(CourseService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async getCourses(level?: CourseLevel): Promise<Partial<Course>[]> {
    const courses = await this.prismaService.course.findMany({
      where: level ? { level } : undefined,
      select: {
        id: true,
        title: true,
        description: true,
        level: true,
        duration: true,
      },
    });
    return courses;
  }

  async createCourse(data: CreateCourseDto) {
    const course = await this.prismaService.course.create({
      data,
    });

    this.logger.log(`Course ${course.id} created`);
  }

  async createCourses(data: CreateCourseDto[]) {
    const courses = await this.prismaService.course.createMany({
      data,
    });

    this.logger.log(` ${courses.count} course created`);
  }

  private async ensureCourseExists(id: number): Promise<void> {
    const exists = await this.prismaService.course.findUnique({
      where: { id },
    });
    if (!exists) {
      throw new NotFoundException(`Course ${id} not found`);
    }
  }

  async updateCourse(id: number, data: UpdateCourseDto) {
    await this.ensureCourseExists(id);

    const courseUpdated = await this.prismaService.course.update({
      where: { id },
      data,
    });

    this.logger.log(`Course ${courseUpdated.id} updated`);
  }

  async getByCourseId(id: number): Promise<Course> {
    const course = await this.prismaService.course.findFirst({
      where: { id },
      include: {
        lessons: true,
      },
    });
    if (!course) {
      throw new NotFoundException(`Course ${id} not found`);
    }
    return course;
  }

  async deleteCourse(id: number) {
    await this.ensureCourseExists(id);

    await this.prismaService.course.delete({
      where: { id },
    });

    this.logger.log(`Course ${id} deleted`);
  }

  async createLesson(data: CreateLessonDto) {
    await this.ensureCourseExists(data.courseId);

    const lesson = await this.prismaService.lesson.create({
      data: {
        title: data.title,
        courseId: data.courseId,
        content_url: data.contentUrl,
        content: data.content,
        order: data.order,
      },
    });

    this.logger.log(`Lesson ${data.courseId} created`);
  }
}
