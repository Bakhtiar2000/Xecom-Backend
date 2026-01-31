import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'src/generated/prisma';

@Injectable()
export class ThanaRepository {
  constructor(private readonly prisma: PrismaService) {}

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

  async create(data: Prisma.ThanaCreateInput) {
    return this.prisma.thana.create({
      data,
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
