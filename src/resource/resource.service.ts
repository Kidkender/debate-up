import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateResourceDto } from './dtos/createResource.dto';
import { S3Service } from 'src/third-party/s3.service';
import { Resource } from '@prisma/client';

@Injectable()
export class ResourceService {
  private readonly logger = new Logger(ResourceService.name);
  constructor(
    private prismaService: PrismaService,
    private s3Service: S3Service,
  ) {}

  async create(
    file: Express.Multer.File,
    createResourceDto: CreateResourceDto,
  ) {
    const fileUrl = await this.s3Service.uploadToCloud(file);

    const newResource = await this.prismaService.resource.create({
      data: { ...createResourceDto, url: fileUrl },
    });

    this.logger.log(`Create new resource ${newResource.id} successfully`);
  }

  async getResource(): Promise<Resource[]> {
    return await this.prismaService.resource.findMany();
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
}
