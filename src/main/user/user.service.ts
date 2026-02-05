import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { TUser } from 'src/interface/token.type';
import {
  Admin,
  Customer,
  Staff,
  UserRole,
  UserStatus,
} from 'src/generated/prisma';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  // ------------------------------- Get Me -------------------------------
  public async getMe(user: TUser) {
    let result: Admin | Customer | Staff | null;
    if (
      user.role !== UserRole.ADMIN &&
      user.role !== UserRole.CUSTOMER &&
      user.role !== UserRole.STAFF
    ) {
      throw new HttpException(
        'Invalid User role provided',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (user.role == UserRole.ADMIN) {
      result = await this.userRepository.findAdminByUserId(user.id);
    } else if (user.role == UserRole.CUSTOMER) {
      result = await this.userRepository.findCustomerByUserId(user.id);
    } else if (user.role == UserRole.STAFF) {
      result = await this.userRepository.findStaffByUserId(user.id);
    } else result = null;
    return result;
  }

  // ------------------------------- Get All Users -------------------------------
  public async getAllUsers() {
    const result = await this.userRepository.findAll();
    return result;
  }

  // ------------------------------- Change User Status -------------------------------
  public async changeUserStatus(id: string, status: UserStatus) {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    const updatedUser = await this.userRepository.updateStatus(id, status);
    return updatedUser;
  }

  /*
  Make registration for three roles seperately on their own modules. No common endpoint like register user

    1. Register customer - access open. flexible dto with  lot of optional field
    2. Register stuff - can be accessed by sup, and admin. a bit rigid dto with some fields to fill up
    3. Register admin - can be accessed by sup. Rigid dto
  */
}
