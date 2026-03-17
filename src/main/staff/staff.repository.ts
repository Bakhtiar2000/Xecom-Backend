import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'src/generated/prisma';

@Injectable()
export class StaffRepository {
  constructor(private readonly prisma: PrismaService) { }

  async findAll() {
    return this.prisma.staff.findMany();
  }

  async findById(id: string) {
    return this.prisma.staff.findUnique({
      where: { id },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.staff.findUnique({
      where: { userId, isActive: true },
      include: {
        user: true,
      },
    });
  }

  async create(data: Prisma.StaffCreateInput) {
    return this.prisma.staff.create({
      data,
    });
  }

  async update(id: string, data: Prisma.StaffUpdateInput) {
    return this.prisma.staff.update({
      where: { id },
      data,
    });
  }

  // User operations needed by StaffService
  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async createUser(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data,
    });
  }

  async createAddress(data: Prisma.AddressCreateInput) {
    return this.prisma.address.create({
      data,
    });
  }
}
