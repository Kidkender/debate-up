import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/role.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CourseLevel } from 'src/common/enumerations/courseLevel.enum';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dtos/create-course.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';

@ApiTags('Course')
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  async getCourses(@Query('level') level?: string) {
    const courseLevel = level as CourseLevel;
    if (courseLevel && !Object.values(CourseLevel).includes(courseLevel)) {
      throw new Error('Invalid course level');
    }
    return this.courseService.getCourses(courseLevel);
  }

  @Get(':id')
  async getCourseById(@Param('id', ParseIntPipe) id: number) {
    return this.courseService.getByCourseId(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  @Roles('admin')
  async createCourse(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.createCourse(createCourseDto);
  }

  @Post('/muti')
  @UseGuards(AuthGuard)
  @Roles('admin')
  async createCourses(@Body() createCourseDto: CreateCourseDto[]) {
    return this.courseService.createCourses(createCourseDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @Roles('admin')
  async updateCourse(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.courseService.updateCourse(id, updateCourseDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles('admin')
  async deleteCourse(@Param('id', ParseIntPipe) id: number) {
    return this.courseService.deleteCourse(id);
  }
}
