import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'src/generated/prisma';

@Injectable()
export class DistrictRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findDivisionById(divisionId: string) {
    return this.prisma.division.findUnique({
      where: { id: divisionId, isActive: true },
    });
  }

  async findByNameAndDivision(name: string, divisionId: string) {
    return this.prisma.district.findFirst({
      where: {
        name,
        divisionId,
      },
    });
  }

  async create(data: Prisma.DistrictCreateInput) {
    return this.prisma.district.create({
      data,
      include: {
        division: {
          include: {
            country: true,
          },
        },
      },
    });
  }

  async findById(id: string) {
    return this.prisma.district.findUnique({
      where: { id, isActive: true },
    });
  }

  async findByIdWithRelations(id: string) {
    return this.prisma.district.findUnique({
      where: { id, isActive: true },
      include: {
        division: {
          include: {
            country: true,
          },
        },
        thanas: {
          where: { isActive: true },
          orderBy: { name: 'asc' },
        },
      },
    });
  }
}
