import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, ProductStatus } from 'src/generated/prisma';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) { }

  async findAll(
    skip: number,
    take: number,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    fields?: string[],
    isActive?: string,
    searchTerm?: string,
  ) {
    // Build where clause
    const where: Prisma.CategoryWhereInput = {};

    if (isActive !== undefined && isActive !== '') {
      where.isActive = isActive === 'true';
    } else {
      where.isActive = true;
    }

    if (searchTerm) {
      where.name = { contains: searchTerm, mode: 'insensitive' };
    }

    // Build orderBy object
    const orderBy: Prisma.CategoryOrderByWithRelationInput = sortBy
      ? ({ [sortBy]: sortOrder || 'asc' } as Prisma.CategoryOrderByWithRelationInput)
      : { sortOrder: 'asc' as Prisma.SortOrder };

    // Build select object if fields are specified
    const select = fields && fields.length > 0
      ? (fields.reduce((acc, field) => ({ ...acc, [field]: true }), {}) as Prisma.CategorySelect)
      : undefined;

    // If select is used, we need to handle includes differently
    const query: any = {
      where,
      skip,
      take,
      orderBy,
    };

    if (select) {
      query.select = {
        ...select,
        _count: { select: { products: true } },
      };
    } else {
      query.include = {
        parent: true,
        children: true,
        _count: { select: { products: true } },
      };
    }

    return this.prisma.category.findMany(query);
  }

  async count(isActive?: string, searchTerm?: string) {
    // Build where clause (same as findAll)
    const where: Prisma.CategoryWhereInput = {};

    if (isActive !== undefined && isActive !== '') {
      where.isActive = isActive === 'true';
    } else {
      where.isActive = true;
    }

    if (searchTerm) {
      where.name = { contains: searchTerm, mode: 'insensitive' };
    }

    return this.prisma.category.count({ where });
  }

  async findById(id: string) {
    return this.prisma.category.findUnique({
      where: { id },
    });
  }

  async findByIdActive(id: string) {
    return this.prisma.category.findFirst({
      where: { id, isActive: true },
    });
  }

  async findByIdWithRelations(id: string) {
    return this.prisma.category.findFirst({
      where: { id, isActive: true },
      include: {
        parent: true,
        children: true,
        products: {
          where: { status: ProductStatus.ACTIVE },
          take: 10,
        },
        _count: { select: { products: true } },
      },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.category.findFirst({
      where: { slug },
    });
  }

  async findBySlugExcludingId(slug: string, excludeId: string) {
    return this.prisma.category.findFirst({
      where: { slug, id: { not: excludeId } },
    });
  }

  async findByIdWithChildren(id: string) {
    return this.prisma.category.findUnique({
      where: { id },
      include: {
        children: true,
        products: true,
      },
    });
  }

  async create(data: Prisma.CategoryCreateInput) {
    return this.prisma.category.create({
      data,
      include: {
        parent: true,
      },
    });
  }

  async update(id: string, data: Prisma.CategoryUpdateInput) {
    return this.prisma.category.update({
      where: { id },
      data,
      include: {
        parent: true,
      },
    });
  }

  async softDelete(id: string) {
    return this.prisma.category.update({
      where: { id },
      data: { isActive: false },
    });
  }

  // Metadata operations
  async countTotal() {
    return this.prisma.category.count();
  }

  async countByIsActive(isActive: boolean) {
    return this.prisma.category.count({
      where: { isActive },
    });
  }
}
