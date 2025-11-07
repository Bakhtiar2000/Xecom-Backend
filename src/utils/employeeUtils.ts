import { HttpException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export class EmployeeUtils {
    constructor(private readonly prisma: PrismaService) { }

    validatePassword(password: string): void {
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

    async generateAdminEmployeeId(): Promise<string> {
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

    async generateStaffEmployeeId(): Promise<string> {
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