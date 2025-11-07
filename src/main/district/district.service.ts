import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDistrictDto } from './district.dto';

@Injectable()
export class DistrictService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    // ------------------------------- Add District -------------------------------
    public async addDistrict(createDistrictDto: CreateDistrictDto) {
        const { name, divisionId } = createDistrictDto;

        // Check if division exists
        const division = await this.prisma.division.findUnique({
            where: { id: divisionId, isActive: true },
        });

        if (!division) {
            throw new HttpException('Division not found', HttpStatus.NOT_FOUND);
        }

        // Check if district already exists in this division
        const existingDistrict = await this.prisma.district.findFirst({
            where: {
                name,
                divisionId,
            },
        });

        if (existingDistrict) {
            throw new HttpException(
                'District with this name already exists in this division',
                HttpStatus.CONFLICT,
            );
        }

        const district = await this.prisma.district.create({
            data: {
                name,
                divisionId,
            },
            include: {
                division: {
                    include: {
                        country: true,
                    },
                },
            },
        });

        return district;
    }

    // ------------------------------- Get Single District -------------------------------
    public async getSingleDistrict(id: string) {
        const district = await this.prisma.district.findUnique({
            where: { id, isActive: true },
            include: {
                division: {
                    include: {
                        country: true,
                    },
                },
                thanas: {
                    where: { isActive: true },
                    orderBy: { name: 'asc' },
                },
            },
        });

        if (!district) {
            throw new HttpException('District not found', HttpStatus.NOT_FOUND);
        }

        return district;
    }
}