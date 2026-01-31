import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CountryRepository } from './country.repository';
import { CreateCountryDto } from './country.dto';

@Injectable()
export class CountryService {
  constructor(private readonly countryRepository: CountryRepository) {}

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
  public async getAllCountries() {
    const countries = await this.countryRepository.findAll();

    return countries;
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
