import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BrandRepository } from './brand.repository';
import { CreateBrandDto, UpdateBrandDto } from './brand.dto';
import calculatePagination from 'src/utils/calculatePagination';

@Injectable()
export class BrandService {
  constructor(private readonly brandRepository: BrandRepository) {}

  // ------------------------------- Get All Brands -------------------------------
  public async getAllBrands(pageNumber: number, pageSize: number) {
    const { skip, take } = calculatePagination({
      page: pageNumber,
      take: pageSize,
    });

    const [brands, total] = await Promise.all([
      this.brandRepository.findAll(skip, take),
      this.brandRepository.count(),
    ]);

    return {
      data: brands,
      meta: {
        pageNumber,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        totalCount: total,
      },
    };
  }

  // ------------------------------- Get Single Brand -------------------------------
  public async getSingleBrand(id: string) {
    const brand = await this.brandRepository.findByIdActive(id);

    if (!brand) {
      throw new HttpException('Brand not found', HttpStatus.NOT_FOUND);
    }

    return brand;
  }

  // ------------------------------- Add Brand -------------------------------
  public async addBrand(createBrandDto: CreateBrandDto) {
    const { name, slug } = createBrandDto;

    // Check if slug already exists
    const existingBrand = await this.brandRepository.findBySlug(slug);

    if (existingBrand) {
      throw new HttpException(
        'Brand with this slug already exists',
        HttpStatus.CONFLICT,
      );
    }

    const brand = await this.brandRepository.create({
      name,
      slug,
      description: createBrandDto.description,
      websiteUrl: createBrandDto.websiteUrl,
      metadata: createBrandDto.metadata || {},
      logoUrl: createBrandDto.logoUrl,
    });

    return brand;
  }

  // ------------------------------- Update Brand -------------------------------
  public async updateBrand(updateBrandDto: UpdateBrandDto) {
    const { id, slug } = updateBrandDto;

    // Check if brand exists
    const existingBrand = await this.brandRepository.findById(id);

    if (!existingBrand) {
      throw new HttpException('Brand not found', HttpStatus.NOT_FOUND);
    }

    // If slug is being updated, check if it's already in use
    if (slug && slug !== existingBrand.slug) {
      const slugExists = await this.brandRepository.findBySlugExcludingId(
        slug,
        id,
      );

      if (slugExists) {
        throw new HttpException(
          'Brand with this slug already exists',
          HttpStatus.CONFLICT,
        );
      }
    }

    const brand = await this.brandRepository.update(id, {
      name: updateBrandDto.name,
      slug: updateBrandDto.slug,
      description: updateBrandDto.description,
      websiteUrl: updateBrandDto.websiteUrl,
      metadata: updateBrandDto.metadata,
      logoUrl: updateBrandDto.logoUrl,
    });

    return brand;
  }

  // ------------------------------- Delete Brand -------------------------------
  public async deleteBrand(id: string) {
    // Check if brand exists
    const brand = await this.brandRepository.findByIdWithProducts(id);

    if (!brand) {
      throw new HttpException('Brand not found', HttpStatus.NOT_FOUND);
    }

    // Soft delete by setting isActive to false
    const deletedBrand = await this.brandRepository.softDelete(id);

    return deletedBrand;
  }
}
