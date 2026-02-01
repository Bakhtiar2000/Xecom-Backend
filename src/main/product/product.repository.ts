import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, ProductStatus } from 'src/generated/prisma';

export interface ProductFilters {
  brandId?: string;
  categoryId?: string;
  searchParam?: string;
  ratingCount?: number;
  reviewCount?: number;
  color?: string;
  size?: string;
  priceStarts?: number;
  priceEnds?: number;
}

@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(skip: number, take: number, filters?: ProductFilters) {
    const where: Prisma.ProductWhereInput = {
      status: ProductStatus.ACTIVE,
    };

    if (filters?.brandId) {
      where.brandId = filters.brandId;
    }

    if (filters?.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters?.searchParam) {
      where.OR = [
        { name: { contains: filters.searchParam, mode: 'insensitive' } },
        {
          shortDescription: {
            contains: filters.searchParam,
            mode: 'insensitive',
          },
        },
        { tags: { has: filters.searchParam } },
      ];
    }

    if (filters?.ratingCount) {
      where.avgRating = { gte: filters.ratingCount };
    }

    if (filters?.reviewCount) {
      where.reviewCount = { gte: filters.reviewCount };
    }

    // For color and size filters, we need to join with variants
    const variantFilters: any = {};
    if (filters?.color || filters?.size) {
      variantFilters.some = {
        attributes: {
          some: {
            OR: [],
          },
        },
      };

      if (filters?.color) {
        variantFilters.some.attributes.some.OR.push({
          attributeValue: {
            value: filters.color,
            attribute: { name: 'Color' },
          },
        });
      }

      if (filters?.size) {
        variantFilters.some.attributes.some.OR.push({
          attributeValue: {
            value: filters.size,
            attribute: { name: 'Size' },
          },
        });
      }

      if (variantFilters.some.attributes.some.OR.length > 0) {
        where.variants = variantFilters;
      }
    }

    // Price filter based on variants
    if (filters?.priceStarts || filters?.priceEnds) {
      const priceFilter: any = {};
      if (filters?.priceStarts) {
        priceFilter.gte = filters.priceStarts;
      }
      if (filters?.priceEnds) {
        priceFilter.lte = filters.priceEnds;
      }

      where.variants = {
        ...where.variants,
        some: {
          ...((where.variants as any)?.some || {}),
          price: priceFilter,
        },
      };
    }

    return this.prisma.product.findMany({
      skip,
      take,
      where,
      include: {
        brand: true,
        category: true,
        images: {
          where: { isFeatured: true },
          take: 1,
        },
        variants: {
          take: 1,
          orderBy: { isDefault: 'desc' },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async count(filters?: ProductFilters) {
    const where: Prisma.ProductWhereInput = {
      status: ProductStatus.ACTIVE,
    };

    if (filters?.brandId) {
      where.brandId = filters.brandId;
    }

    if (filters?.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters?.searchParam) {
      where.OR = [
        { name: { contains: filters.searchParam, mode: 'insensitive' } },
        {
          shortDescription: {
            contains: filters.searchParam,
            mode: 'insensitive',
          },
        },
        { tags: { has: filters.searchParam } },
      ];
    }

    if (filters?.ratingCount) {
      where.avgRating = { gte: filters.ratingCount };
    }

    if (filters?.reviewCount) {
      where.reviewCount = { gte: filters.reviewCount };
    }

    return this.prisma.product.count({ where });
  }

  async findById(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  async findByIdActive(id: string) {
    return this.prisma.product.findUnique({
      where: { id, status: ProductStatus.ACTIVE },
      include: {
        brand: true,
        category: true,
        images: true,
        variants: {
          include: {
            attributes: {
              include: {
                attributeValue: {
                  include: {
                    attribute: true,
                  },
                },
              },
            },
          },
        },
        reviews: {
          where: { isApproved: true },
          include: {
            customer: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        relations: {
          include: {
            relatedTo: {
              include: {
                images: {
                  where: { isFeatured: true },
                  take: 1,
                },
                variants: {
                  take: 1,
                  orderBy: { isDefault: 'desc' },
                },
              },
            },
          },
          orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
        },
      },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.product.findFirst({
      where: { slug },
    });
  }

  async findBySlugExcludingId(slug: string, excludeId: string) {
    return this.prisma.product.findFirst({
      where: { slug, id: { not: excludeId } },
    });
  }

  async create(data: Prisma.ProductCreateInput) {
    return this.prisma.product.create({
      data,
    });
  }

  async update(id: string, data: Prisma.ProductUpdateInput) {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string) {
    return this.prisma.product.update({
      where: { id },
      data: { status: ProductStatus.DISCONTINUED },
    });
  }

  async incrementViewCount(id: string) {
    return this.prisma.product.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });
  }
}
