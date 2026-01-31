import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStaffDto } from './staff.dto';
import { UserRole } from 'src/generated/prisma';
import { EmployeeUtils } from 'src/utils/employeeUtils';
import { LibService } from 'src/lib/lib.service';

@Injectable()
export class StaffService {
  private employeeUtils: EmployeeUtils;

  constructor(
    private readonly prisma: PrismaService,
    private readonly lib: LibService,
  ) {
    this.employeeUtils = new EmployeeUtils(this.prisma);
  }

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
    this.employeeUtils.validatePassword(dto.password);

    // Generate employee ID if not provided
    const employeeId = await this.employeeUtils.generateStaffEmployeeId();
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
}
