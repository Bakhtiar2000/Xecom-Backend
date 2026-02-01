import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, ProductRelationType } from 'src/generated/prisma';

@Injectable()
export class ProductRelationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ProductRelationCreateInput) {
    return this.prisma.productRelation.create({
      data,
      include: {
        product: {
          select: { id: true, name: true, slug: true },
        },
        relatedTo: {
          select: { id: true, name: true, slug: true },
        },
      },
    });
  }

  async createMany(data: Prisma.ProductRelationCreateManyInput[]) {
    return this.prisma.productRelation.createMany({
      data,
      skipDuplicates: true,
    });
  }

  async findById(id: string) {
    return this.prisma.productRelation.findUnique({
      where: { id },
      include: {
        product: true,
        relatedTo: true,
      },
    });
  }

  async findByProductAndType(productId: string, type?: ProductRelationType) {
    const where: Prisma.ProductRelationWhereInput = { productId };
    if (type) {
      where.type = type;
    }

    return this.prisma.productRelation.findMany({
      where,
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
    });
  }

  async update(id: string, data: Prisma.ProductRelationUpdateInput) {
    return this.prisma.productRelation.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.productRelation.delete({
      where: { id },
    });
  }

  async deleteByProductAndRelated(
    productId: string,
    relatedToId: string,
    type: ProductRelationType,
  ) {
    return this.prisma.productRelation.deleteMany({
      where: {
        productId,
        relatedToId,
        type,
      },
    });
  }

  async deleteAllByProduct(productId: string, type?: ProductRelationType) {
    const where: Prisma.ProductRelationWhereInput = { productId };
    if (type) {
      where.type = type;
    }

    return this.prisma.productRelation.deleteMany({
      where,
    });
  }
}
