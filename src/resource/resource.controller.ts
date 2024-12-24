import {
  Body,
  Controller,
  Delete,
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
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { ROLE } from 'src/common/enumerations/role.enum';

@ApiTags('Resource')
@UseGuards(AuthGuard, RolesGuard)
@Controller('resource')
export class ResourceController {
  constructor(private resourceService: ResourceService) {}

  @Post()
  @Roles(ROLE.ADMIN)
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

  @Get('category')
  async findByCategory(@Query('categoryId') categoryId: number) {
    return this.resourceService.getResourceByCategory(categoryId);
  }

  @Get(':id')
  async getResource(@Param('id', ParseIntPipe) id: number) {
    return await this.resourceService.getResourceById(id);
  }

  @Delete(':id')
  @Roles(ROLE.ADMIN)
  async deleteResource(@Param('id', ParseIntPipe) id: number) {
    return await this.resourceService.deleteResource(id);
  }
}
