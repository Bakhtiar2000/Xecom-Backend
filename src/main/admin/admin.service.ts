import { HttpException, Injectable } from '@nestjs/common';
import { AdminRepository } from './admin.repository';
import { CreateAdminDto } from './admin.dto';
import { UserRole } from 'src/generated/prisma';
import { EmployeeUtils } from 'src/utils/employeeUtils';
import { LibService } from 'src/lib/lib.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminService {
    private employeeUtils: EmployeeUtils;

    constructor(
        private readonly adminRepository: AdminRepository,
        private readonly lib: LibService,
        private readonly prisma: PrismaService,
    ) {
        this.employeeUtils = new EmployeeUtils(this.prisma);
    }

    public async getAllAdmins() {
        const result = await this.adminRepository.findAll();
        return result;
    }

    public async addAnAdmin(dto: CreateAdminDto) {
        const user = await this.adminRepository.findUserByEmail(dto.email);
        if (user) throw new HttpException('User already exists', 409);

        // Validate password
        this.employeeUtils.validatePassword(dto.password);

        // Generate employee ID if not provided
        const employeeId = await this.employeeUtils.generateAdminEmployeeId();

        const hashedPassword = await this.lib.hashPassword({
            password: dto.password,
        });

        const newUser = await this.adminRepository.createUser({
            name: dto.name,
            email: dto.email,
            password: hashedPassword,
            phoneNumber: dto.phoneNumber,
            profilePicture: dto.profilePicture,
            gender: dto.gender,
            role: UserRole.ADMIN,
        });
        const newAdmin = await this.adminRepository.create({
            user: {
                connect: { id: newUser.id },
            },
            employeeId: employeeId,
            hireDate: dto.hireDate,
            notes: dto.notes,
        });
        return newAdmin;
    }
}
