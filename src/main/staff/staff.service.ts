import { HttpException, Injectable } from '@nestjs/common';
import { StaffRepository } from './staff.repository';
import { CreateStaffDto } from './staff.dto';
import { UserRole } from 'src/generated/prisma';
import { EmployeeUtils } from 'src/utils/employeeUtils';
import { LibService } from 'src/lib/lib.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StaffService {
    private employeeUtils: EmployeeUtils;

    constructor(
        private readonly staffRepository: StaffRepository,
        private readonly lib: LibService,
        private readonly prisma: PrismaService,
    ) {
        this.employeeUtils = new EmployeeUtils(this.prisma);
    }

    public async getAllStaffs() {
        const result = await this.staffRepository.findAll();
        return result;
    }

    public async addAStaff(dto: CreateStaffDto) {
        const user = await this.staffRepository.findUserByEmail(dto.email);
        if (user) throw new HttpException('User already exists', 409);

        // Validate password
        this.employeeUtils.validatePassword(dto.password);

        // Generate employee ID if not provided
        const employeeId = await this.employeeUtils.generateStaffEmployeeId();
        const hashedPassword = await this.lib.hashPassword({
            password: dto.password,
        });

        const newUser = await this.staffRepository.createUser({
            name: dto.name,
            email: dto.email,
            password: hashedPassword,
            phoneNumber: dto.phoneNumber,
            profilePicture: dto.profilePicture,
            gender: dto.gender,
            role: UserRole.STAFF,
        });
        const newStaff = await this.staffRepository.create({
            user: {
                connect: { id: newUser.id },
            },
            employeeId: employeeId,
            hireDate: dto.hireDate,
            notes: dto.notes,
        });
        return newStaff;
    }
}
