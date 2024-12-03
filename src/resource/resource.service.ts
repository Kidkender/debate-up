import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateResourceDto } from './dtos/createResource.dto';
import { S3Service } from 'src/third-party/s3.service';
import { Resource } from '@prisma/client';
import { FilterResourceDto } from './dtos/filter-resource.dto';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class ResourceService {
  private readonly logger = new Logger(ResourceService.name);
  constructor(
    private prismaService: PrismaService,
    private s3Service: S3Service,
    private readonly categoryService: CategoryService,
  ) {}

  async createResource(
    file: Express.Multer.File,
    createResourceDto: CreateResourceDto,
  ) {
    await this.categoryService.findById(createResourceDto.categoryId);

    const fileUrl = await this.s3Service.uploadToCloud(file);

    const newResource = await this.prismaService.resource.create({
      data: { ...createResourceDto, url: fileUrl },
    });

    this.logger.log(`Create new resource ${newResource.id} successfully`);
  }

  async getResources(filterDto: FilterResourceDto): Promise<Resource[]> {
    const { categoryId, type, search } = filterDto;
    const normalizedSearch = search?.toLowerCase();

    return await this.prismaService.resource.findMany({
      where: {
        ...(categoryId && { categoryId }),
        ...(type && { type }),
        ...(search && {
          OR: [
            {
              title: {
                contains: normalizedSearch,
              },
            },
            {
              description: {
                contains: normalizedSearch,
              },
            },
          ],
        }),
      },
    });
  }

  async getResourceById(id: number): Promise<Resource> {
    const resource = await this.prismaService.resource.findFirst({
      where: {
        id,
      },
    });

    if (!resource) {
      throw new BadRequestException(`Resource ${id} not found`);
    }
    return resource;
  }

  async updateFile(id: number, file: Express.Multer.File): Promise<Resource> {
    const resource = await this.getResourceById(id);

    if (resource.url) {
      const oldKey = this.extractKeyFromUrl(resource.url);
      await this.s3Service.deleteFromCloud(oldKey);
    }

    const newFileUrl = await this.s3Service.uploadToCloud(file);

    const updatedResource = await this.prismaService.resource.update({
      where: { id },
      data: { url: newFileUrl },
    });

    this.logger.log(`Updated resource ${id} with new file`);
    return updatedResource;
  }

  private extractKeyFromUrl(url: string): string {
    const key = url.split('.amazonaws.com/')[1];
    if (!key) {
      throw new BadRequestException('Invalid S3 URL');
    }
    return key;
  }

  async getResourceByCategory(categoryId: number): Promise<Resource[]> {
    return this.prismaService.resource.findMany({ where: { categoryId } });
  }
}
