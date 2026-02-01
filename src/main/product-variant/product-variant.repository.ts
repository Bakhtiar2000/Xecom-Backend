import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'src/generated/prisma';

@Injectable()
export class ProductVariantRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByProductId(productId: string) {
    return this.prisma.productVariant.findMany({
      where: { productId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
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
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async findById(id: string) {
    return this.prisma.productVariant.findUnique({
      where: { id },
      include: {
        product: true,
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
    });
  }

  async findBySku(sku: string) {
    return this.prisma.productVariant.findUnique({
      where: { sku },
    });
  }

  async findBySkuExcludingId(sku: string, excludeId: string) {
    return this.prisma.productVariant.findFirst({
      where: { sku, id: { not: excludeId } },
    });
  }

  async create(data: Prisma.ProductVariantCreateInput) {
    return this.prisma.productVariant.create({
      data,
      include: {
        product: true,
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
    });
  }

  async update(id: string, data: Prisma.ProductVariantUpdateInput) {
    return this.prisma.productVariant.update({
      where: { id },
      data,
      include: {
        product: true,
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
    });
  }

  async delete(id: string) {
    return this.prisma.productVariant.delete({
      where: { id },
    });
  }

  async createVariantAttribute(variantId: string, attributeValueId: string) {
    return this.prisma.productVariantAttribute.create({
      data: {
        variant: {
          connect: { id: variantId },
        },
        attributeValue: {
          connect: { id: attributeValueId },
        },
      },
    });
  }

  async deleteVariantAttributes(variantId: string) {
    return this.prisma.productVariantAttribute.deleteMany({
      where: { variantId },
    });
  }
}
