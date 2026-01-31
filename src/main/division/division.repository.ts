import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'src/generated/prisma';

@Injectable()
export class DivisionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findCountryById(countryId: string) {
    return this.prisma.country.findUnique({
      where: { id: countryId, isActive: true },
    });
  }

  async findByNameAndCountry(name: string, countryId: string) {
    return this.prisma.division.findFirst({
      where: {
        name,
        countryId,
      },
    });
  }

  async create(data: Prisma.DivisionCreateInput) {
    return this.prisma.division.create({
      data,
      include: {
        country: true,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.division.findUnique({
      where: { id, isActive: true },
    });
  }

  async findByIdWithRelations(id: string) {
    return this.prisma.division.findUnique({
      where: { id, isActive: true },
      include: {
        country: true,
        districts: {
          where: { isActive: true },
          orderBy: { name: 'asc' },
        },
      },
    });
  }
}
