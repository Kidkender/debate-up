import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/role.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CreateLessonDto } from './dtos/create-lesson.dto';
import { UpdateLessonDto } from './dtos/update-lesson.dto';
import { LessonService } from './lesson.service';

@Controller('lesson')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Roles('admin')
  async createLesson(@Body() req: CreateLessonDto) {
    return this.lessonService.createLesson(req);
  }

  @Patch(':id')
  async updateLesson(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLessonDto: UpdateLessonDto,
  ) {
    return this.lessonService.updateLesson(id, updateLessonDto);
  }

  @Get()
  async getLessons() {
    return this.lessonService.getLessons();
  }

  @Get(':id')
  async getLessonById(@Param('id') id: number) {
    return this.lessonService.getLessonById(id);
  }

  @Delete(':id')
  async deleteLesson(@Param('id', ParseIntPipe) id: number) {
    return await this.lessonService.deleteLesson(id);
  }
}
