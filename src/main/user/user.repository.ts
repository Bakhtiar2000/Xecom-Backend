import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, UserStatus } from 'src/generated/prisma';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async updateStatus(id: string, status: UserStatus) {
    return this.prisma.user.update({
      where: { id },
      data: { status },
    });
  }

  // Role-specific operations
  async findAdminByUserId(userId: string) {
    return this.prisma.admin.findUniqueOrThrow({
      where: { userId, isActive: true },
      include: {
        user: true,
      },
    });
  }

  async findCustomerByUserId(userId: string) {
    return this.prisma.customer.findUniqueOrThrow({
      where: { userId, isActive: true },
      include: {
        user: true,
      },
    });
  }

  async findStaffByUserId(userId: string) {
    return this.prisma.staff.findUniqueOrThrow({
      where: { userId, isActive: true },
      include: {
        user: true,
      },
    });
  }
}
