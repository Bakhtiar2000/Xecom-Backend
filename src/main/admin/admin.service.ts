import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAdminDto } from './admin.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class AdminService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    public async getAllAdmins() {
        const result = await this.prisma.admin.findMany();
        return result;
    }

    public async addAnAdmin(dto: CreateAdminDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (user) throw new HttpException('User already exists', 409);

        // Validate password
        this.validatePassword(dto.password);

        // Generate employee ID if not provided
        const employeeId = dto.employeeId || await this.generateAdminEmployeeId();

        const newUser = await this.prisma.user.create({
            data: {
                name: dto.name,
                email: dto.email,
                password: dto.password,
                phoneNumber: dto.phoneNumber,
                profilePicture: dto.profilePicture,
                gender: dto.gender,
                role: UserRole.ADMIN,
            },
        });
        const newAdmin = await this.prisma.admin.create({
            data: {
                userId: newUser.id,
                employeeId: employeeId,
                hireDate: dto.hireDate,
                notes: dto.notes,

            },
        });
        return newAdmin;
    }

    private validatePassword(password: string): void {
        if (password.length < 6) {
            throw new HttpException('Password must be at least 6 characters long', 400);
        }

        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);

        if (!hasUpperCase) {
            throw new HttpException('Password must contain at least one uppercase letter', 400);
        }
        if (!hasLowerCase) {
            throw new HttpException('Password must contain at least one lowercase letter', 400);
        }
        if (!hasNumber) {
            throw new HttpException('Password must contain at least one number', 400);
        }
    }

    private async generateAdminEmployeeId(): Promise<string> {
        // Find the latest admin with employee ID pattern A-XXX
        const latestAdmin = await this.prisma.admin.findFirst({
            where: {
                employeeId: {
                    startsWith: 'A-'
                }
            },
            orderBy: {
                employeeId: 'desc'
            }
        });

        let nextNumber = 1;
        if (latestAdmin && latestAdmin.employeeId) {
            const currentNumber = parseInt(latestAdmin.employeeId.split('-')[1]);
            nextNumber = currentNumber + 1;
        }

        return `A-${nextNumber.toString().padStart(3, '0')}`;
    }
}

