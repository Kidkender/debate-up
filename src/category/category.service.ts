import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Category } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);
  constructor(private prismaService: PrismaService) {}

  async create(data: CreateCategoryDto) {
    const existName = await this.prismaService.category.findFirst({
      where: { name: data.name },
    });
    if (existName) {
      throw new BadRequestException(`Category name ${data.name} exists`);
    }

    await this.prismaService.category.create({ data });
    this.logger.log(`Category ${data} created`);
  }

  async findById(id: number): Promise<Category> {
    const category = await this.prismaService.category.findFirst({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category ${id} not found`);
    }

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const { name, description } = updateCategoryDto;

    const category = await this.findById(id);

    await this.prismaService.category.update({
      where: { id },
      data: {
        name: name ?? category.name,
        description: description ?? category.description,
      },
    });

    this.logger.log(`Updated category ${id} successfully`);
  }

  async findAll(): Promise<Category[]> {
    return await this.prismaService.category.findMany();
  }

  async remove(id: number) {
    const category = await this.findById(id);

    await this.prismaService.category.delete({
      where: { id },
    });
    this.logger.log(`Removing category ${id} successfully `);
  }
}
