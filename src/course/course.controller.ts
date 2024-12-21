import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseLevel } from 'src/common/enumerations/courseLevel.enum';
import { CreateCourseDto } from './dtos/create-course.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/decorators/role.decorator';

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

  @Put(':id')
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
