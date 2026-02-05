import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DistrictRepository } from './district.repository';
import { CreateDistrictDto } from './district.dto';

@Injectable()
export class DistrictService {
  constructor(private readonly districtRepository: DistrictRepository) {}

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

  // ------------------------------- Get Single District -------------------------------
  public async getSingleDistrict(id: string) {
    const district = await this.districtRepository.findByIdWithRelations(id);

    if (!district) {
      throw new HttpException('District not found', HttpStatus.NOT_FOUND);
    }

    return district;
  }
}
