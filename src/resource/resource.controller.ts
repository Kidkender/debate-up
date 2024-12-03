import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ResourceService } from './resource.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateResourceDto } from './dtos/createResource.dto';

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
    return this.resourceService.create(file, data);
  }

  @Get()
  async getResources() {
    return await this.resourceService.getResource();
  }

  @Get('/:id')
  async getResource(@Param('id', ParseIntPipe) id: number) {
    return await this.resourceService.getResourceById(id);
  }
}
