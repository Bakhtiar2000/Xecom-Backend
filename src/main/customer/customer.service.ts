import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCustomerDto } from './customer.dto';
import { LibService } from 'src/lib/lib.service';

@Injectable()
export class CustomerService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly lib: LibService,
    ) { }

    public async getAllCustomers() {
        const result = await this.prisma.customer.findMany();
        return result;
    }

    async addCustomer(dto: CreateCustomerDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (user) throw new HttpException('User already exists', 409);
        const hashedPassword = await this.lib.hashPassword({
            password: dto.password,
            round: 6,
        });

        const newUser = await this.prisma.user.create({
            data: { ...dto, password: hashedPassword },
        });

        const newCustomer = await this.prisma.customer.create({
            data: {
                userId: newUser.id,
            },
        })
        return newCustomer;
    }
}