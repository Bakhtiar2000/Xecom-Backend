import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import calculatePagination from 'src/utils/calculatePagination';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) { }

  // ------------------------------- Get All Categories -------------------------------
  public async getAllCategories(
    pageNumber: number,
    pageSize: number,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    fields?: string,
    isActive?: string,
    searchTerm?: string,
    targetAudience?: string,
  ) {
    const { skip, take } = calculatePagination({
      page: pageNumber,
      take: pageSize,
    });

    // Parse fields string into array
    const selectedFields = fields
      ? fields.split(',').map((field) => field.trim())
      : undefined;

    const [categories, total] = await Promise.all([
      this.categoryRepository.findAll(
        skip,
        take,
        sortBy,
        sortOrder,
        selectedFields,
        isActive,
        searchTerm,
        targetAudience,
      ),
      this.categoryRepository.count(isActive, searchTerm, targetAudience),
    ]);

    return {
      data: categories,
      meta: {
        pageNumber,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        totalCount: total,
      },
    };
  }

  // ------------------------------- Get Single Category -------------------------------
  public async getSingleCategory(id: string) {
    const category = await this.categoryRepository.findByIdWithRelations(id);

    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    return category;
  }

  // ------------------------------- Add Category -------------------------------
  public async addCategory(createCategoryDto: CreateCategoryDto) {
    const { name, slug, parentId, targetAudience, isActive } = createCategoryDto;

    // Check if slug already exists
    const existingCategory = await this.categoryRepository.findBySlug(slug);

    if (existingCategory) {
      throw new HttpException(
        'Category with this slug already exists',
        HttpStatus.CONFLICT,
      );
    }

    // If parentId is provided, check if parent exists
    if (parentId) {
      const parent = await this.categoryRepository.findByIdActive(parentId);

      if (!parent) {
        throw new HttpException(
          'Parent category not found',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    const category = await this.categoryRepository.create({
      name,
      slug,
      description: createCategoryDto.description,
      parent: parentId ? { connect: { id: parentId } } : undefined,
      sortOrder: createCategoryDto.sortOrder || 0,
      seoTitle: createCategoryDto.seoTitle,
      seoDescription: createCategoryDto.seoDescription,
      metadata: createCategoryDto.metadata || {},
      imageUrl: createCategoryDto.imageUrl,
      targetAudience: targetAudience ? { set: targetAudience } : undefined,
      isActive: isActive !== undefined ? isActive : true,
    });

    return category;
  }

  // ------------------------------- Update Category -------------------------------
  public async updateCategory(updateCategoryDto: UpdateCategoryDto) {
    const { id, slug, parentId, targetAudience, isActive } = updateCategoryDto;

    // Check if category exists
    const existingCategory = await this.categoryRepository.findById(id);

    if (!existingCategory) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    // If slug is being updated, check if it's already in use
    if (slug && slug !== existingCategory.slug) {
      const slugExists = await this.categoryRepository.findBySlugExcludingId(
        slug,
        id,
      );

      if (slugExists) {
        throw new HttpException(
          'Category with this slug already exists',
          HttpStatus.CONFLICT,
        );
      }
    }

    // If parentId is being updated, check if parent exists and prevent circular reference
    if (parentId) {
      if (parentId === id) {
        throw new HttpException(
          'Category cannot be its own parent',
          HttpStatus.BAD_REQUEST,
        );
      }

      const parent = await this.categoryRepository.findByIdActive(parentId);

      if (!parent) {
        throw new HttpException(
          'Parent category not found',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    const category = await this.categoryRepository.update(id, {
      name: updateCategoryDto.name,
      slug: updateCategoryDto.slug,
      description: updateCategoryDto.description,
      parent: updateCategoryDto.parentId
        ? { connect: { id: updateCategoryDto.parentId } }
        : undefined,
      sortOrder: updateCategoryDto.sortOrder,
      seoTitle: updateCategoryDto.seoTitle,
      seoDescription: updateCategoryDto.seoDescription,
      metadata: updateCategoryDto.metadata,
      imageUrl: updateCategoryDto.imageUrl,
      targetAudience: targetAudience !== undefined ? { set: targetAudience } : undefined,
      isActive: isActive,
    });

    return category;
  }

  // ------------------------------- Delete Category -------------------------------
  public async deleteCategory(id: string) {
    // Check if category exists
    const category = await this.categoryRepository.findByIdWithChildren(id);

    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    // Check if category has children
    if (category.children.length > 0) {
      throw new HttpException(
        'Cannot delete category with subcategories',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Soft delete by setting isActive to false
    const deletedCategory = await this.categoryRepository.softDelete(id);

    return deletedCategory;
  }

  // ------------------------------- Get Categories Metadata -------------------------------
  public async getCategoriesMetadata() {
    const [totalCategories, totalActiveCategories, totalInactiveCategories] =
      await Promise.all([
        this.categoryRepository.countTotal(),
        this.categoryRepository.countByIsActive(true),
        this.categoryRepository.countByIsActive(false),
      ]);

    return {
      totalCategories,
      totalActiveCategories,
      totalInactiveCategories,
    };
  }
}
