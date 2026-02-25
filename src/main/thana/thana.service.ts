import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ThanaRepository } from './thana.repository';
import { CreateThanaDto } from './thana.dto';
import calculatePagination from 'src/utils/calculatePagination';

@Injectable()
export class ThanaService {
  constructor(private readonly thanaRepository: ThanaRepository) { }

  // ------------------------------- Add Thana -------------------------------
  public async addThana(createThanaDto: CreateThanaDto) {
    const { name, districtId } = createThanaDto;

    // Check if district exists
    const district = await this.thanaRepository.findDistrictById(districtId);

    if (!district) {
      throw new HttpException('District not found', HttpStatus.NOT_FOUND);
    }

    // Check if thana already exists in this district
    const existingThana = await this.thanaRepository.findByNameAndDistrict(
      name,
      districtId,
    );

    if (existingThana) {
      throw new HttpException(
        'Thana with this name already exists in this district',
        HttpStatus.CONFLICT,
      );
    }

    const thana = await this.thanaRepository.create({
      name,
      district: {
        connect: { id: districtId },
      },
    });

    return thana;
  }

  // ------------------------------- Get All Thanas -------------------------------
  public async getAllThanas(
    pageNumber: number,
    pageSize: number,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    searchTerm?: string,
    countryId?: string,
    divisionId?: string,
    districtId?: string,
  ) {
    const { skip, take } = calculatePagination({
      page: pageNumber,
      take: pageSize,
    });

    const [thanas, total] = await Promise.all([
      this.thanaRepository.findAll(
        skip,
        take,
        sortBy,
        sortOrder,
        searchTerm,
        countryId,
        divisionId,
        districtId,
      ),
      this.thanaRepository.count(searchTerm, countryId, divisionId, districtId),
    ]);

    return {
      data: thanas,
      meta: {
        pageNumber,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        totalCount: total,
      },
    };
  }
}
