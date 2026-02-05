import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ThanaRepository } from './thana.repository';
import { CreateThanaDto } from './thana.dto';

@Injectable()
export class ThanaService {
  constructor(private readonly thanaRepository: ThanaRepository) {}

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
}
