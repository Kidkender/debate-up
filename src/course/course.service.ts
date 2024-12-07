import { Injectable, NotFoundException } from '@nestjs/common';
import { Course } from '@prisma/client';
import { CourseLevel } from 'src/common/enumerations/courseLevel.enum';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto } from './dtos/create-course.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';

@Injectable()
export class CourseService {
  constructor(private readonly prismaService: PrismaService) {}

  async getCourses(level?: CourseLevel) {
    if (level) {
      return this.prismaService.course.findMany({
        where: { level },
      });
    }
    return this.prismaService.course.findMany();
  }

  async createCourse(data: CreateCourseDto) {
    return this.prismaService.course.create({
      data,
    });
  }

  async updateCourse(id: number, data: UpdateCourseDto) {
    await this.getByCourseId(id);
    return this.prismaService.course.update({
      where: { id },
      data,
    });
  }

  async getByCourseId(id: number): Promise<Course> {
    const course = await this.prismaService.course.findFirst({ where: { id } });
    if (!course) {
      throw new NotFoundException(`Course ${id} not found`);
    }
    return course;
  }

  async deleteCourse(id: number) {
    await this.getByCourseId(id);
    return this.prismaService.course.delete({
      where: { id },
    });
  }
}
