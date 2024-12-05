import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto, UpdateCourseDto, FilterCourseDto } from './dto';
import { CourseLevel } from '@prisma/client';

@Injectable()
export class CourseService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Tạo mới một khóa học
   */
  async create(createCourseDto: CreateCourseDto) {
    const { title, level } = createCourseDto;

    // Kiểm tra xem khóa học đã tồn tại chưa
    const existingCourse = await this.prisma.course.findUnique({
      where: { title },
    });

    if (existingCourse) {
      throw new BadRequestException(
        `Course with title '${title}' already exists.`,
      );
    }

    // Tạo khóa học mới
    const newCourse = await this.prisma.course.create({
      data: createCourseDto,
    });

    return newCourse;
  }

  /**
   * Lấy danh sách các khóa học
   */
  async findAll(filterCourseDto: FilterCourseDto) {
    const { level, isPublished } = filterCourseDto;

    const courses = await this.prisma.course.findMany({
      where: {
        ...(level && { level }), // Lọc theo cấp độ (BASIC, INTERMEDIATE, ADVANCED)
        ...(isPublished !== undefined && { isPublished }), // Lọc theo trạng thái phát hành
      },
      include: {
        contents: true, // Bao gồm nội dung của khóa học
        feedbacks: true, // Bao gồm feedbacks
      },
    });

    return courses;
  }

  /**
   * Lấy thông tin chi tiết của một khóa học
   */
  async findById(id: number) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        contents: true,
        feedbacks: true,
        prerequisites: {
          include: { prereq: true }, // Bao gồm thông tin điều kiện tiên quyết
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID '${id}' not found.`);
    }

    return course;
  }

  /**
   * Cập nhật thông tin một khóa học
   */
  async update(id: number, updateCourseDto: UpdateCourseDto) {
    const existingCourse = await this.prisma.course.findUnique({
      where: { id },
    });

    if (!existingCourse) {
      throw new NotFoundException(`Course with ID '${id}' not found.`);
    }

    const updatedCourse = await this.prisma.course.update({
      where: { id },
      data: updateCourseDto,
    });

    return updatedCourse;
  }

  /**
   * Xóa một khóa học
   */
  async delete(id: number) {
    const existingCourse = await this.prisma.course.findUnique({
      where: { id },
    });

    if (!existingCourse) {
      throw new NotFoundException(`Course with ID '${id}' not found.`);
    }

    await this.prisma.course.delete({ where: { id } });

    return { message: `Course with ID '${id}' has been deleted successfully.` };
  }

  /**
   * Lấy danh sách khóa học theo điều kiện tiên quyết
   */
  async getCoursesWithPrerequisites(courseId: number) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        prerequisites: {
          include: { prereq: true }, // Bao gồm thông tin điều kiện tiên quyết
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID '${courseId}' not found.`);
    }

    return course.prerequisites.map((p) => p.prereq);
  }
}
