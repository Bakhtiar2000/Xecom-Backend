import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, UserStatus } from 'src/generated/prisma';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findActiveUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email, status: UserStatus.ACTIVE },
    });
  }

  async findUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async updateUser(id: string, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async updateUserByEmail(email: string, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({
      where: { email },
      data,
    });
  }

  async findActiveUserByEmailOrThrow(email: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: { email, status: UserStatus.ACTIVE },
    });
  }
}
