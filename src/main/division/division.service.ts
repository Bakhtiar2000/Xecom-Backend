import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DivisionRepository } from './division.repository';
import { CreateDivisionDto } from './division.dto';
import calculatePagination from 'src/utils/calculatePagination';

@Injectable()
export class DivisionService {
  constructor(private readonly divisionRepository: DivisionRepository) { }

  // ------------------------------- Add Division -------------------------------
  public async addDivision(createDivisionDto: CreateDivisionDto) {
    const { name, countryId } = createDivisionDto;

    // Check if country exists
    const country = await this.divisionRepository.findCountryById(countryId);

    if (!country) {
      throw new HttpException('Country not found', HttpStatus.NOT_FOUND);
    }

    // Check if division already exists in this country
    const existingDivision = await this.divisionRepository.findByNameAndCountry(
      name,
      countryId,
    );

    if (existingDivision) {
      throw new HttpException(
        'Division with this name already exists in this country',
        HttpStatus.CONFLICT,
      );
    }

    const division = await this.divisionRepository.create({
      name,
      country: {
        connect: { id: countryId },
      },
    });

    return division;
  }

  // ------------------------------- Get All Divisions -------------------------------
  public async getAllDivisions(
    pageNumber: number,
    pageSize: number,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    searchTerm?: string,
    countryId?: string,
  ) {
    const { skip, take } = calculatePagination({
      page: pageNumber,
      take: pageSize,
    });

    const [divisions, total] = await Promise.all([
      this.divisionRepository.findAll(
        skip,
        take,
        sortBy,
        sortOrder,
        searchTerm,
        countryId,
      ),
      this.divisionRepository.count(searchTerm, countryId),
    ]);

    return {
      data: divisions,
      meta: {
        pageNumber,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        totalCount: total,
      },
    };
  }

  // ------------------------------- Get Single Division -------------------------------
  public async getSingleDivision(id: string) {
    const division = await this.divisionRepository.findByIdWithRelations(id);

    if (!division) {
      throw new HttpException('Division not found', HttpStatus.NOT_FOUND);
    }

    return division;
  }
}
