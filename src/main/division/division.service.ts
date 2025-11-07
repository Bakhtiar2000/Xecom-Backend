import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDivisionDto } from './division.dto';

@Injectable()
export class DivisionService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    // ------------------------------- Add Division -------------------------------
    public async addDivision(createDivisionDto: CreateDivisionDto) {
        const { name, countryId } = createDivisionDto;

        // Check if country exists
        const country = await this.prisma.country.findUnique({
            where: { id: countryId, isActive: true },
        });

        if (!country) {
            throw new HttpException('Country not found', HttpStatus.NOT_FOUND);
        }

        // Check if division already exists in this country
        const existingDivision = await this.prisma.division.findFirst({
            where: {
                name,
                countryId,
            },
        });

        if (existingDivision) {
            throw new HttpException(
                'Division with this name already exists in this country',
                HttpStatus.CONFLICT,
            );
        }

        const division = await this.prisma.division.create({
            data: {
                name,
                countryId,
            },
            include: {
                country: true,
            },
        });

        return division;
    }

    // ------------------------------- Get Single Division -------------------------------
    public async getSingleDivision(id: string) {
        const division = await this.prisma.division.findUnique({
            where: { id, isActive: true },
            include: {
                country: true,
                districts: {
                    where: { isActive: true },
                    orderBy: { name: 'asc' },
                },
            },
        });

        if (!division) {
            throw new HttpException('Division not found', HttpStatus.NOT_FOUND);
        }

        return division;
    }
}