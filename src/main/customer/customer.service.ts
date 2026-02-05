import { HttpException, Injectable } from '@nestjs/common';
import { CustomerRepository } from './customer.repository';
import { CreateCustomerDto } from './customer.dto';
import { LibService } from 'src/lib/lib.service';

@Injectable()
export class CustomerService {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly lib: LibService,
  ) {}

  public async getAllCustomers() {
    const result = await this.customerRepository.findAll();
    return result;
  }

  async addCustomer(dto: CreateCustomerDto) {
    const user = await this.customerRepository.findUserByEmail(dto.email);
    if (user) throw new HttpException('User already exists', 409);
    const hashedPassword = await this.lib.hashPassword({
      password: dto.password,
    });

    const newUser = await this.customerRepository.createUser({
      ...dto,
      password: hashedPassword,
    });

    const newCustomer = await this.customerRepository.create({
      user: {
        connect: { id: newUser.id },
      },
    });
    return newCustomer;
  }
}
