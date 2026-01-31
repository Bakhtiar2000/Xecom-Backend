import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'src/generated/prisma';

@Injectable()
export class CountryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByNameOrCode(name: string, code?: string) {
    return this.prisma.country.findFirst({
      where: {
        OR: [{ name }, ...(code ? [{ code }] : [])],
      },
    });
  }

  async create(data: Prisma.CountryCreateInput) {
    return this.prisma.country.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.country.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string) {
    return this.prisma.country.findUnique({
      where: { id, isActive: true },
    });
  }

  async findByIdWithDivisions(id: string) {
    return this.prisma.country.findUnique({
      where: { id, isActive: true },
      include: {
        divisions: {
          where: { isActive: true },
          orderBy: { name: 'asc' },
        },
      },
    });
  }
}
