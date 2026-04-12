import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthProvider, Prisma, UserRole, UserStatus } from 'src/generated/prisma';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) { }

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

  async createGoogleUser(payload: {
    email: string;
    name: string;
    profilePicture: string;
  }) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: payload.email,
          name: payload.name,
          profilePicture: payload.profilePicture,
          provider: AuthProvider.GOOGLE,
          role: UserRole.CUSTOMER,
          emailVerified: true,
        },
      });

      await tx.customer.create({
        data: {
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      return user;
    });
  }
}
