import { Category } from '@prisma/client';
import { CategoryResponseDto } from './dtos/category-response.dto';

export class CategoryMapper {
  public static toResponseDto(category: Category): CategoryResponseDto {
    return {
      id: category.id,
      name: category.name,
      description: category.description,
    };
  }

  public static toListCategoryResponse(
    categories: Category[],
  ): CategoryResponseDto[] {
    return categories.map((item, index) => CategoryMapper.toResponseDto(item));
  }
}
