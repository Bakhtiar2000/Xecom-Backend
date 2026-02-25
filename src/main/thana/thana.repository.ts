import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'src/generated/prisma';

@Injectable()
export class ThanaRepository {
  constructor(private readonly prisma: PrismaService) { }

  async findDistrictById(districtId: string) {
    return this.prisma.district.findUnique({
      where: { id: districtId, isActive: true },
    });
  }

  async findByNameAndDistrict(name: string, districtId: string) {
    return this.prisma.thana.findFirst({
      where: {
        name,
        districtId,
      },
    });
  }

  async findAll(
    skip: number,
    take: number,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    searchTerm?: string,
    countryId?: string,
    divisionId?: string,
    districtId?: string,
  ) {
    // Build where clause
    const where: Prisma.ThanaWhereInput = { isActive: true };

    if (districtId) {
      where.districtId = districtId;
    } else if (divisionId || countryId) {
      // Build nested district filter
      where.district = {} as any;

      if (divisionId) {
        (where.district as any).divisionId = divisionId;
      }

      if (countryId) {
        (where.district as any).division = {
          countryId: countryId,
        };
      }
    }

    if (searchTerm) {
      where.name = { contains: searchTerm, mode: 'insensitive' };
    }

    // Build orderBy object
    const orderBy: Prisma.ThanaOrderByWithRelationInput = sortBy
      ? ({ [sortBy]: sortOrder || 'asc' } as Prisma.ThanaOrderByWithRelationInput)
      : { name: 'asc' as Prisma.SortOrder };

    return this.prisma.thana.findMany({
      where,
      skip,
      take,
      orderBy,
    });
  }

  async count(
    searchTerm?: string,
    countryId?: string,
    divisionId?: string,
    districtId?: string,
  ) {
    const where: Prisma.ThanaWhereInput = { isActive: true };

    if (districtId) {
      where.districtId = districtId;
    } else if (divisionId || countryId) {
      // Build nested district filter
      where.district = {} as any;

      if (divisionId) {
        (where.district as any).divisionId = divisionId;
      }

      if (countryId) {
        (where.district as any).division = {
          countryId: countryId,
        };
      }
    }

    if (searchTerm) {
      where.name = { contains: searchTerm, mode: 'insensitive' };
    }

    return this.prisma.thana.count({ where });
  }

  async create(data: Prisma.ThanaCreateInput) {
    return this.prisma.thana.create({
      data,
    });
  }

  async findById(id: string) {
    return this.prisma.thana.findUnique({
      where: { id, isActive: true },
    });
  }

  async findByIdWithRelations(id: string) {
    return this.prisma.thana.findUnique({
      where: { id, isActive: true },
      include: {
        district: {
          include: {
            division: {
              include: {
                country: true,
              },
            },
          },
        },
      },
    });
  }
}
