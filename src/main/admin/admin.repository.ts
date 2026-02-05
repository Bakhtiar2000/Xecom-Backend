import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'src/generated/prisma';

@Injectable()
export class AdminRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.admin.findMany();
  }

  async findById(id: string) {
    return this.prisma.admin.findUnique({
      where: { id },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.admin.findUnique({
      where: { userId, isActive: true },
      include: {
        user: true,
      },
    });
  }

  async create(data: Prisma.AdminCreateInput) {
    return this.prisma.admin.create({
      data,
    });
  }

  async update(id: string, data: Prisma.AdminUpdateInput) {
    return this.prisma.admin.update({
      where: { id },
      data,
    });
  }

  // User operations needed by AdminService
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
}
