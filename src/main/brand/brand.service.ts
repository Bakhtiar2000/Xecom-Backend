import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBrandDto, UpdateBrandDto } from './brand.dto';
import calculatePagination from 'src/utils/calculatePagination';
import { ProductStatus } from 'src/generated/prisma';

@Injectable()
export class BrandService {
  constructor(private readonly prisma: PrismaService) {}

  // ------------------------------- Get All Brands -------------------------------
  public async getAllBrands(pageNumber: number, pageSize: number) {
    const { skip, take } = calculatePagination({
      page: pageNumber,
      take: pageSize,
    });

    const [brands, total] = await Promise.all([
      this.prisma.brand.findMany({
        skip,
        take,
        where: { isActive: true },
        include: {
          products: {
            where: { status: ProductStatus.ACTIVE },
            take: 5,
          },
        },
        orderBy: {
          name: 'asc',
        },
      }),
      this.prisma.brand.count({ where: { isActive: true } }),
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
    const brand = await this.prisma.brand.findUnique({
      where: { id, isActive: true },
      include: {
        products: {
          where: { status: ProductStatus.ACTIVE },
          take: 20,
        },
      },
    });

    if (!brand) {
      throw new HttpException('Brand not found', HttpStatus.NOT_FOUND);
    }

    return brand;
  }

  // ------------------------------- Add Brand -------------------------------
  public async addBrand(createBrandDto: CreateBrandDto) {
    const { name, slug } = createBrandDto;

    // Check if slug already exists
    const existingBrand = await this.prisma.brand.findFirst({
      where: { slug },
    });

    if (existingBrand) {
      throw new HttpException(
        'Brand with this slug already exists',
        HttpStatus.CONFLICT,
      );
    }

    const brand = await this.prisma.brand.create({
      data: {
        name,
        slug,
        description: createBrandDto.description,
        websiteUrl: createBrandDto.websiteUrl,
        metadata: createBrandDto.metadata || {},
        logoUrl: createBrandDto.logoUrl,
      },
    });

    return brand;
  }

  // ------------------------------- Update Brand -------------------------------
  public async updateBrand(updateBrandDto: UpdateBrandDto) {
    const { id, slug } = updateBrandDto;

    // Check if brand exists
    const existingBrand = await this.prisma.brand.findUnique({
      where: { id },
    });

    if (!existingBrand) {
      throw new HttpException('Brand not found', HttpStatus.NOT_FOUND);
    }

    // If slug is being updated, check if it's already in use
    if (slug && slug !== existingBrand.slug) {
      const slugExists = await this.prisma.brand.findFirst({
        where: { slug, id: { not: id } },
      });

      if (slugExists) {
        throw new HttpException(
          'Brand with this slug already exists',
          HttpStatus.CONFLICT,
        );
      }
    }

    const brand = await this.prisma.brand.update({
      where: { id },
      data: {
        name: updateBrandDto.name,
        slug: updateBrandDto.slug,
        description: updateBrandDto.description,
        websiteUrl: updateBrandDto.websiteUrl,
        metadata: updateBrandDto.metadata,
        logoUrl: updateBrandDto.logoUrl,
      },
    });

    return brand;
  }

  // ------------------------------- Delete Brand -------------------------------
  public async deleteBrand(id: string) {
    // Check if brand exists
    const brand = await this.prisma.brand.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });

    if (!brand) {
      throw new HttpException('Brand not found', HttpStatus.NOT_FOUND);
    }

    // Soft delete by setting isActive to false
    const deletedBrand = await this.prisma.brand.update({
      where: { id },
      data: { isActive: false },
    });

    return deletedBrand;
  }
}
