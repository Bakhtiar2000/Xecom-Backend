import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, ProductStatus } from 'src/generated/prisma';

@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaService) { }

  async findAll(
    skip: number,
    take: number,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    fields?: string[],
    isActive?: string,
    searchTerm?: string,
    brandId?: string,
    categoryId?: string,
    tag?: string,
    ratingCount?: number,
    reviewCount?: number,
    color?: string,
    size?: string,
    priceStarts?: number,
    priceEnds?: number,
  ) {
    // Build where clause
    const where: Prisma.ProductWhereInput = {};

    // Handle isActive filter
    if (isActive !== undefined && isActive !== '') {
      where.status = isActive === 'true' ? ProductStatus.ACTIVE : { not: ProductStatus.ACTIVE };
    } else {
      where.status = ProductStatus.ACTIVE;
    }

    if (brandId) {
      where.brandId = brandId;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (searchTerm) {
      where.OR = [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        {
          shortDescription: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        { tags: { has: searchTerm } },
      ];
    }

    if (tag) {
      where.tags = { has: tag };
    }

    if (ratingCount) {
      where.avgRating = { gte: ratingCount };
    }

    if (reviewCount) {
      where.reviewCount = { gte: reviewCount };
    }

    // For color and size filters, we need to join with variants
    const variantFilters: any = {};
    if (color || size) {
      variantFilters.some = {
        attributes: {
          some: {
            OR: [],
          },
        },
      };

      if (color) {
        variantFilters.some.attributes.some.OR.push({
          attributeValue: {
            value: color,
            attribute: { name: 'Color' },
          },
        });
      }

      if (size) {
        variantFilters.some.attributes.some.OR.push({
          attributeValue: {
            value: size,
            attribute: { name: 'Size' },
          },
        });
      }

      if (variantFilters.some.attributes.some.OR.length > 0) {
        where.variants = variantFilters;
      }
    }

    // Price filter based on variants
    if (priceStarts || priceEnds) {
      const priceFilter: any = {};
      if (priceStarts) {
        priceFilter.gte = priceStarts;
      }
      if (priceEnds) {
        priceFilter.lte = priceEnds;
      }

      where.variants = {
        ...where.variants,
        some: {
          ...((where.variants as any)?.some || {}),
          price: priceFilter,
        },
      };
    }

    // Build orderBy object
    const orderBy: Prisma.ProductOrderByWithRelationInput = sortBy
      ? ({ [sortBy]: sortOrder || 'asc' } as Prisma.ProductOrderByWithRelationInput)
      : { createdAt: 'desc' as Prisma.SortOrder };

    // Build select object if fields are specified
    const select = fields && fields.length > 0
      ? (fields.reduce((acc, field) => ({ ...acc, [field]: true }), {}) as Prisma.ProductSelect)
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
        _count: { select: { images: true, variants: true } },
      };
    } else {
      query.include = {
        _count: { select: { images: true, variants: true } },
      };
    }

    return this.prisma.product.findMany(query);
  }

  async count(
    isActive?: string,
    searchTerm?: string,
    brandId?: string,
    categoryId?: string,
    tag?: string,
    ratingCount?: number,
    reviewCount?: number,
  ) {
    // Build where clause (same as findAll)
    const where: Prisma.ProductWhereInput = {};

    // Handle isActive filter
    if (isActive !== undefined && isActive !== '') {
      where.status = isActive === 'true' ? ProductStatus.ACTIVE : { not: ProductStatus.ACTIVE };
    } else {
      where.status = ProductStatus.ACTIVE;
    }

    if (brandId) {
      where.brandId = brandId;
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (searchTerm) {
      where.OR = [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        {
          shortDescription: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        { tags: { has: searchTerm } },
      ];
    }

    if (tag) {
      where.tags = { has: tag };
    }

    if (ratingCount) {
      where.avgRating = { gte: ratingCount };
    }

    if (reviewCount) {
      where.reviewCount = { gte: reviewCount };
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
