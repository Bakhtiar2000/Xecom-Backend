import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, ProductStatus } from 'src/generated/prisma';

@Injectable()
export class BrandRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(skip: number, take: number) {
    return this.prisma.brand.findMany({
      skip,
      take,
      where: { isActive: true },
      include: {
        products: {
          where: { status: ProductStatus.ACTIVE },
          take: 5,
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async count() {
    return this.prisma.brand.count({ where: { isActive: true } });
  }

  async findById(id: string) {
    return this.prisma.brand.findUnique({
      where: { id },
    });
  }

  async findByIdActive(id: string) {
    return this.prisma.brand.findUnique({
      where: { id, isActive: true },
      include: {
        products: {
          where: { status: ProductStatus.ACTIVE },
          take: 20,
        },
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
}
