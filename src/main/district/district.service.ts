import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DistrictRepository } from './district.repository';
import { CreateDistrictDto } from './district.dto';
import calculatePagination from 'src/utils/calculatePagination';

@Injectable()
export class DistrictService {
  constructor(private readonly districtRepository: DistrictRepository) { }

  // ------------------------------- Add District -------------------------------
  public async addDistrict(createDistrictDto: CreateDistrictDto) {
    const { name, divisionId } = createDistrictDto;

    // Check if division exists
    const division = await this.districtRepository.findDivisionById(divisionId);

    if (!division) {
      throw new HttpException('Division not found', HttpStatus.NOT_FOUND);
    }

    // Check if district already exists in this division
    const existingDistrict =
      await this.districtRepository.findByNameAndDivision(name, divisionId);

    if (existingDistrict) {
      throw new HttpException(
        'District with this name already exists in this division',
        HttpStatus.CONFLICT,
      );
    }

    const district = await this.districtRepository.create({
      name,
      division: {
        connect: { id: divisionId },
      },
    });

    return district;
  }

  // ------------------------------- Get All Districts -------------------------------
  public async getAllDistricts(
    pageNumber: number,
    pageSize: number,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    searchTerm?: string,
    countryId?: string,
    divisionId?: string,
  ) {
    const { skip, take } = calculatePagination({
      page: pageNumber,
      take: pageSize,
    });

    const [districts, total] = await Promise.all([
      this.districtRepository.findAll(
        skip,
        take,
        sortBy,
        sortOrder,
        searchTerm,
        countryId,
        divisionId,
      ),
      this.districtRepository.count(searchTerm, countryId, divisionId),
    ]);

    return {
      data: districts,
      meta: {
        pageNumber,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        totalCount: total,
      },
    };
  }

  // ------------------------------- Get Single District -------------------------------
  public async getSingleDistrict(id: string) {
    const district = await this.districtRepository.findByIdWithRelations(id);

    if (!district) {
      throw new HttpException('District not found', HttpStatus.NOT_FOUND);
    }

    return district;
  }
}
