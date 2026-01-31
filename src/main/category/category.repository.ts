import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, ProductStatus } from 'src/generated/prisma';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(skip: number, take: number) {
    return this.prisma.category.findMany({
      skip,
      take,
      where: { isActive: true },
      include: {
        parent: true,
        children: true,
      },
      orderBy: {
        sortOrder: 'asc',
      },
    });
  }

  async count() {
    return this.prisma.category.count({ where: { isActive: true } });
  }

  async findById(id: string) {
    return this.prisma.category.findUnique({
      where: { id },
    });
  }

  async findByIdActive(id: string) {
    return this.prisma.category.findUnique({
      where: { id, isActive: true },
    });
  }

  async findByIdWithRelations(id: string) {
    return this.prisma.category.findUnique({
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
}
