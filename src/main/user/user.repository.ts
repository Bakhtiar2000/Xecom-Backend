import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, UserStatus, UserRole, Gender } from 'src/generated/prisma';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) { }

  async findAll(
    skip: number,
    take: number,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    fields?: string[],
    gender?: string,
    role?: string,
    emailVerified?: string,
    status?: string,
    searchTerm?: string,
  ) {
    // Build where clause
    const where: Prisma.UserWhereInput = {};

    if (gender) {
      where.gender = gender as Gender;
    }

    if (role) {
      where.role = role as UserRole;
    }

    if (emailVerified !== undefined && emailVerified !== '') {
      where.emailVerified = emailVerified === 'true';
    }

    if (status) {
      where.status = status as UserStatus;
    }

    if (searchTerm) {
      where.OR = [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { email: { contains: searchTerm, mode: 'insensitive' } },
        { phoneNumber: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    // Build orderBy object
    const orderBy: Prisma.UserOrderByWithRelationInput = sortBy
      ? ({ [sortBy]: sortOrder || 'asc' } as Prisma.UserOrderByWithRelationInput)
      : { createdAt: 'desc' as Prisma.SortOrder };

    // Build select object if fields are specified
    const select = fields && fields.length > 0
      ? (fields.reduce((acc, field) => ({ ...acc, [field]: true }), {}) as Prisma.UserSelect)
      : undefined;

    return this.prisma.user.findMany({
      where,
      skip,
      take,
      orderBy,
      ...(select && { select }),
    });
  }

  async count(
    gender?: string,
    role?: string,
    emailVerified?: string,
    status?: string,
    searchTerm?: string,
  ) {
    // Build where clause (same as findAll)
    const where: Prisma.UserWhereInput = {};

    if (gender) {
      where.gender = gender as Gender;
    }

    if (role) {
      where.role = role as UserRole;
    }

    if (emailVerified !== undefined && emailVerified !== '') {
      where.emailVerified = emailVerified === 'true';
    }

    if (status) {
      where.status = status as UserStatus;
    }

    if (searchTerm) {
      where.OR = [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { email: { contains: searchTerm, mode: 'insensitive' } },
        { phoneNumber: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    return this.prisma.user.count({ where });
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

  // Metadata operations
  async countTotal() {
    return this.prisma.user.count();
  }

  async countByStatus(status: UserStatus) {
    return this.prisma.user.count({
      where: { status },
    });
  }

  async countByStatusNot(status: UserStatus) {
    return this.prisma.user.count({
      where: { status: { not: status } },
    });
  }

  async countVerified() {
    return this.prisma.user.count({
      where: { emailVerified: true },
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
