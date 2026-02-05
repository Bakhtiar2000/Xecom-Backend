import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'src/generated/prisma';

@Injectable()
export class AttributeRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ==================== Attribute Methods ====================
  async findAllAttributes() {
    return this.prisma.attribute.findMany({
      include: {
        values: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findAttributeById(id: string) {
    return this.prisma.attribute.findUnique({
      where: { id },
      include: {
        values: true,
      },
    });
  }

  async findAttributeByName(name: string) {
    return this.prisma.attribute.findFirst({
      where: { name },
    });
  }

  async createAttribute(data: Prisma.AttributeCreateInput) {
    return this.prisma.attribute.create({
      data,
      include: {
        values: true,
      },
    });
  }

  async updateAttribute(id: string, data: Prisma.AttributeUpdateInput) {
    return this.prisma.attribute.update({
      where: { id },
      data,
      include: {
        values: true,
      },
    });
  }

  async deleteAttribute(id: string) {
    return this.prisma.attribute.delete({
      where: { id },
    });
  }

  // ==================== Attribute Value Methods ====================
  async findAttributeValueById(id: string) {
    return this.prisma.attributeValue.findUnique({
      where: { id },
      include: {
        attribute: true,
      },
    });
  }

  async findAttributeValueByValueAndAttribute(
    value: string,
    attributeId: string,
  ) {
    return this.prisma.attributeValue.findFirst({
      where: {
        value,
        attributeId,
      },
    });
  }

  async findAttributeValueByHexCodeAndAttribute(
    hexCode: string,
    attributeId: string,
  ) {
    return this.prisma.attributeValue.findFirst({
      where: {
        hexCode,
        attributeId,
      },
    });
  }

  async createAttributeValue(data: Prisma.AttributeValueCreateInput) {
    return this.prisma.attributeValue.create({
      data,
      include: {
        attribute: true,
      },
    });
  }

  async updateAttributeValue(
    id: string,
    data: Prisma.AttributeValueUpdateInput,
  ) {
    console.log('Updating Attribute Value:', id, data);
    return this.prisma.attributeValue.update({
      where: { id },
      data,
      include: {
        attribute: true,
      },
    });
  }

  async deleteAttributeValue(id: string) {
    return this.prisma.attributeValue.delete({
      where: { id },
    });
  }
}
