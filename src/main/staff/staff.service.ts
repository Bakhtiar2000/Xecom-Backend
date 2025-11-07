import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStaffDto } from './staff.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class StaffService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    public async getAllStaffs() {
        const result = await this.prisma.staff.findMany();
        return result;
    }

    public async addAStaff(dto: CreateStaffDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (user) throw new HttpException('User already exists', 409);

        // Validate password
        this.validatePassword(dto.password);

        // Generate employee ID if not provided
        const employeeId = dto.employeeId || await this.generateStaffEmployeeId();

        const newUser = await this.prisma.user.create({
            data: {
                name: dto.name,
                email: dto.email,
                password: dto.password,
                phoneNumber: dto.phoneNumber,
                profilePicture: dto.profilePicture,
                gender: dto.gender,
                role: UserRole.STAFF,
            },
        });
        const newStaff = await this.prisma.staff.create({
            data: {
                userId: newUser.id,
                employeeId: employeeId,
                hireDate: dto.hireDate,
                notes: dto.notes,

            },
        });
        return newStaff;
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

    private async generateStaffEmployeeId(): Promise<string> {
        // Find the latest staff with employee ID pattern S-XXX
        const latestStaff = await this.prisma.staff.findFirst({
            where: {
                employeeId: {
                    startsWith: 'S-'
                }
            },
            orderBy: {
                employeeId: 'desc'
            }
        });

        let nextNumber = 1;
        if (latestStaff && latestStaff.employeeId) {
            const currentNumber = parseInt(latestStaff.employeeId.split('-')[1]);
            nextNumber = currentNumber + 1;
        }

        return `S-${nextNumber.toString().padStart(3, '0')}`;
    }
}
