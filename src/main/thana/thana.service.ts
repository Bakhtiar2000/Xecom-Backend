import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateThanaDto } from './thana.dto';

@Injectable()
export class ThanaService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    // ------------------------------- Add Thana -------------------------------
    public async addThana(createThanaDto: CreateThanaDto) {
        const { name, districtId } = createThanaDto;

        // Check if district exists
        const district = await this.prisma.district.findUnique({
            where: { id: districtId, isActive: true },
        });

        if (!district) {
            throw new HttpException('District not found', HttpStatus.NOT_FOUND);
        }

        // Check if thana already exists in this district
        const existingThana = await this.prisma.thana.findFirst({
            where: {
                name,
                districtId,
            },
        });

        if (existingThana) {
            throw new HttpException(
                'Thana with this name already exists in this district',
                HttpStatus.CONFLICT,
            );
        }

        const thana = await this.prisma.thana.create({
            data: {
                name,
                districtId,
            },
            include: {
                district: {
                    include: {
                        division: {
                            include: {
                                country: true,
                            },
                        },
                    },
                },
            },
        });

        return thana;
    }
}