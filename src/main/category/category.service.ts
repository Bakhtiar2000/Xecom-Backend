import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import calculatePagination from 'src/utils/calculatePagination';
import { ProductStatus } from 'src/generated/prisma';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  // ------------------------------- Get All Categories -------------------------------
  public async getAllCategories(pageNumber: number, pageSize: number) {
    const { skip, take } = calculatePagination({
      page: pageNumber,
      take: pageSize,
    });

    const [categories, total] = await Promise.all([
      this.prisma.category.findMany({
        skip,
        take: take,
        where: { isActive: true },
        include: {
          parent: true,
          children: true,
        },
        orderBy: {
          sortOrder: 'asc',
        },
      }),
      this.prisma.category.count({ where: { isActive: true } }),
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
    const category = await this.prisma.category.findUnique({
      where: { id, isActive: true },
      include: {
        parent: true,
        children: true,
        products: {
          where: { status: ProductStatus.ACTIVE },
          take: 10,
        },
      },
    });

    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    return category;
  }

  // ------------------------------- Add Category -------------------------------
  public async addCategory(createCategoryDto: CreateCategoryDto) {
    const { name, slug, parentId } = createCategoryDto;

    // Check if slug already exists
    const existingCategory = await this.prisma.category.findFirst({
      where: { slug },
    });

    if (existingCategory) {
      throw new HttpException(
        'Category with this slug already exists',
        HttpStatus.CONFLICT,
      );
    }

    // If parentId is provided, check if parent exists
    if (parentId) {
      const parent = await this.prisma.category.findUnique({
        where: { id: parentId, isActive: true },
      });

      if (!parent) {
        throw new HttpException(
          'Parent category not found',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    const category = await this.prisma.category.create({
      data: {
        name,
        slug,
        description: createCategoryDto.description,
        parentId,
        sortOrder: createCategoryDto.sortOrder || 0,
        seoTitle: createCategoryDto.seoTitle,
        seoDescription: createCategoryDto.seoDescription,
        metadata: createCategoryDto.metadata || {},
        imageUrl: createCategoryDto.imageUrl,
      },
      include: {
        parent: true,
      },
    });

    return category;
  }

  // ------------------------------- Update Category -------------------------------
  public async updateCategory(updateCategoryDto: UpdateCategoryDto) {
    const { id, slug, parentId } = updateCategoryDto;

    // Check if category exists
    const existingCategory = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    // If slug is being updated, check if it's already in use
    if (slug && slug !== existingCategory.slug) {
      const slugExists = await this.prisma.category.findFirst({
        where: { slug, id: { not: id } },
      });

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

      const parent = await this.prisma.category.findUnique({
        where: { id: parentId, isActive: true },
      });

      if (!parent) {
        throw new HttpException(
          'Parent category not found',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    const category = await this.prisma.category.update({
      where: { id },
      data: {
        name: updateCategoryDto.name,
        slug: updateCategoryDto.slug,
        description: updateCategoryDto.description,
        parentId: updateCategoryDto.parentId,
        sortOrder: updateCategoryDto.sortOrder,
        seoTitle: updateCategoryDto.seoTitle,
        seoDescription: updateCategoryDto.seoDescription,
        metadata: updateCategoryDto.metadata,
        imageUrl: updateCategoryDto.imageUrl,
      },
      include: {
        parent: true,
      },
    });

    return category;
  }

  // ------------------------------- Delete Category -------------------------------
  public async deleteCategory(id: string) {
    // Check if category exists
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        children: true,
        products: true,
      },
    });

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
    const deletedCategory = await this.prisma.category.update({
      where: { id },
      data: { isActive: false },
    });

    return deletedCategory;
  }
}
