import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ResourceService } from './resource.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateResourceDto } from './dtos/createResource.dto';
import { FilterResourceDto } from './dtos/filter-resource.dto';

@Controller('resource')
export class ResourceController {
  constructor(private resourceService: ResourceService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async createResource(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: CreateResourceDto,
  ) {
    return this.resourceService.createResource(file, data);
  }

  @Get()
  findAll(@Query() filterDto: FilterResourceDto) {
    return this.resourceService.getResources(filterDto);
  }

  @Get('/:id')
  async getResource(@Param('id', ParseIntPipe) id: number) {
    return await this.resourceService.getResourceById(id);
  }

  @Get()
  async findByCategory(@Query('categoryId') categoryId: number) {
    return this.resourceService.getResourceByCategory(categoryId);
  }
}
