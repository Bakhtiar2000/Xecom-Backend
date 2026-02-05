import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DivisionRepository } from './division.repository';
import { CreateDivisionDto } from './division.dto';

@Injectable()
export class DivisionService {
  constructor(private readonly divisionRepository: DivisionRepository) {}

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

  // ------------------------------- Get Single Division -------------------------------
  public async getSingleDivision(id: string) {
    const division = await this.divisionRepository.findByIdWithRelations(id);

    if (!division) {
      throw new HttpException('Division not found', HttpStatus.NOT_FOUND);
    }

    return division;
  }
}
