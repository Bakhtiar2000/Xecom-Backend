import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, ProductStatus } from 'src/generated/prisma';

@Injectable()
export class BrandRepository {
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
    const where: Prisma.BrandWhereInput = {};

    if (isActive !== undefined && isActive !== '') {
      where.isActive = isActive === 'true';
    } else {
      where.isActive = true;
    }

    if (searchTerm) {
      where.name = { contains: searchTerm, mode: 'insensitive' };
    }

    // Build orderBy object
    const orderBy: Prisma.BrandOrderByWithRelationInput = sortBy
      ? ({ [sortBy]: sortOrder || 'asc' } as Prisma.BrandOrderByWithRelationInput)
      : { name: 'asc' as Prisma.SortOrder };

    // Build select object if fields are specified
    const select = fields && fields.length > 0
      ? (fields.reduce((acc, field) => ({ ...acc, [field]: true }), {}) as Prisma.BrandSelect)
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
        products: {
          where: { status: ProductStatus.ACTIVE },
          take: 5,
        },
        _count: { select: { products: true } },
      };
    }

    return this.prisma.brand.findMany(query);
  }

  async count(isActive?: string, searchTerm?: string) {
    // Build where clause (same as findAll)
    const where: Prisma.BrandWhereInput = {};

    if (isActive !== undefined && isActive !== '') {
      where.isActive = isActive === 'true';
    } else {
      where.isActive = true;
    }

    if (searchTerm) {
      where.name = { contains: searchTerm, mode: 'insensitive' };
    }

    return this.prisma.brand.count({ where });
  }

  async findById(id: string) {
    return this.prisma.brand.findUnique({
      where: { id },
    });
  }

  async findByIdActive(id: string) {
    return this.prisma.brand.findFirst({
      where: { id, isActive: true },
      include: {
        products: {
          where: { status: ProductStatus.ACTIVE },
          take: 20,
        },
        _count: { select: { products: true } },
      },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.brand.findFirst({
      where: { slug },
    });
  }

  async findBySlugExcludingId(slug: string, excludeId: string) {
    return this.prisma.brand.findFirst({
      where: { slug, id: { not: excludeId } },
    });
  }

  async findByIdWithProducts(id: string) {
    return this.prisma.brand.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });
  }

  async create(data: Prisma.BrandCreateInput) {
    return this.prisma.brand.create({
      data,
    });
  }

  async update(id: string, data: Prisma.BrandUpdateInput) {
    return this.prisma.brand.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string) {
    return this.prisma.brand.update({
      where: { id },
      data: { isActive: false },
    });
  }

  // Metadata operations
  async countTotal() {
    return this.prisma.brand.count();
  }

  async countByIsActive(isActive: boolean) {
    return this.prisma.brand.count({
      where: { isActive },
    });
  }
}
