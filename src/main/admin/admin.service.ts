import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAdminDto } from './admin.dto';
import { UserRole } from '@prisma/client';
import { EmployeeUtils } from 'src/utils/employeeUtils';
import { LibService } from 'src/lib/lib.service';

@Injectable()
export class AdminService {
    private employeeUtils: EmployeeUtils;

    constructor(
        private readonly prisma: PrismaService,
        private readonly lib: LibService,

    ) {
        this.employeeUtils = new EmployeeUtils(this.prisma);
    }

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
        this.employeeUtils.validatePassword(dto.password);

        // Generate employee ID if not provided
        const employeeId = await this.employeeUtils.generateAdminEmployeeId();

        const hashedPassword = await this.lib.hashPassword({
            password: dto.password,
            round: 6,
        });

        const newUser = await this.prisma.user.create({
            data: {
                name: dto.name,
                email: dto.email,
                password: hashedPassword,
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
}

