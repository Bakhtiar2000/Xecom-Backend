import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCountryDto } from './country.dto';

@Injectable()
export class CountryService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    // ------------------------------- Add Country -------------------------------
    public async addCountry(createCountryDto: CreateCountryDto) {
        const { name, code } = createCountryDto;

        // Check if country already exists
        const existingCountry = await this.prisma.country.findFirst({
            where: {
                OR: [
                    { name },
                    ...(code ? [{ code }] : [])
                ]
            }
        });

        if (existingCountry) {
            throw new HttpException(
                'Country with this name or code already exists',
                HttpStatus.CONFLICT,
            );
        }

        const country = await this.prisma.country.create({
            data: {
                name,
                code,
            },
        });

        return country;
    }

    // ------------------------------- Get All Countries -------------------------------
    public async getAllCountries() {
        const countries = await this.prisma.country.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' },
        });

        return countries;
    }

    // ------------------------------- Get Single Country -------------------------------
    public async getSingleCountry(id: string) {
        const country = await this.prisma.country.findUnique({
            where: { id, isActive: true },
            include: {
                divisions: {
                    where: { isActive: true },
                    orderBy: { name: 'asc' },
                },
            },
        });

        if (!country) {
            throw new HttpException('Country not found', HttpStatus.NOT_FOUND);
        }

        return country;
    }
}