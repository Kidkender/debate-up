import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateResourceDto } from './dtos/createResource.dto';

@Injectable()
export class ResourceService {
  constructor(private prisma: PrismaService) {}

  async create(createResourceDto: CreateResourceDto) {
    return this.prisma.resource.create({
      data: createResourceDto,
    });
  }
}
