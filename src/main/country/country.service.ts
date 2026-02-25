import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CountryRepository } from './country.repository';
import { CreateCountryDto } from './country.dto';
import calculatePagination from 'src/utils/calculatePagination';

@Injectable()
export class CountryService {
  constructor(private readonly countryRepository: CountryRepository) { }

  // ------------------------------- Add Country -------------------------------
  public async addCountry(createCountryDto: CreateCountryDto) {
    const { name, code } = createCountryDto;

    // Check if country already exists
    const existingCountry = await this.countryRepository.findByNameOrCode(
      name,
      code,
    );

    if (existingCountry) {
      throw new HttpException(
        'Country with this name or code already exists',
        HttpStatus.CONFLICT,
      );
    }

    const country = await this.countryRepository.create({
      name,
      code,
    });

    return country;
  }

  // ------------------------------- Get All Countries -------------------------------
  public async getAllCountries(
    pageNumber: number,
    pageSize: number,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    searchTerm?: string,
  ) {
    const { skip, take } = calculatePagination({
      page: pageNumber,
      take: pageSize,
    });

    const [countries, total] = await Promise.all([
      this.countryRepository.findAll(
        skip,
        take,
        sortBy,
        sortOrder,
        searchTerm,
      ),
      this.countryRepository.count(searchTerm),
    ]);

    return {
      data: countries,
      meta: {
        pageNumber,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        totalCount: total,
      },
    };
  }

  // ------------------------------- Get Single Country -------------------------------
  public async getSingleCountry(id: string) {
    const country = await this.countryRepository.findByIdWithDivisions(id);

    if (!country) {
      throw new HttpException('Country not found', HttpStatus.NOT_FOUND);
    }

    return country;
  }
}
