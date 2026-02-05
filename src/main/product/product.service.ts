import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProductRepository, ProductFilters } from './product.repository';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import calculatePagination from 'src/utils/calculatePagination';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  // ------------------------------- Get All Products -------------------------------
  public async getAllProducts(
    pageNumber: number,
    pageSize: number,
    filters?: ProductFilters,
  ) {
    const { skip, take } = calculatePagination({
      page: pageNumber,
      take: pageSize,
    });

    const [products, total] = await Promise.all([
      this.productRepository.findAll(skip, take, filters),
      this.productRepository.count(filters),
    ]);

    return {
      data: products,
      meta: {
        pageNumber,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        totalCount: total,
      },
    };
  }

  // ------------------------------- Get Single Product -------------------------------
  public async getSingleProduct(id: string) {
    const product = await this.productRepository.findByIdActive(id);

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    // Increment view count
    await this.productRepository.incrementViewCount(id);

    return product;
  }

  // ------------------------------- Add Product -------------------------------
  public async addProduct(createProductDto: CreateProductDto) {
    const { slug } = createProductDto;

    // Check if slug already exists
    const existingProduct = await this.productRepository.findBySlug(slug);

    if (existingProduct) {
      throw new HttpException(
        'Product with this slug already exists',
        HttpStatus.CONFLICT,
      );
    }

    const product = await this.productRepository.create({
      name: createProductDto.name,
      slug: createProductDto.slug,
      shortDescription: createProductDto.shortDescription,
      fullDescription: createProductDto.fullDescription,
      brand: createProductDto.brandId
        ? { connect: { id: createProductDto.brandId } }
        : undefined,
      category: createProductDto.categoryId
        ? { connect: { id: createProductDto.categoryId } }
        : undefined,
      status: createProductDto.status || 'DRAFT',
      featured: createProductDto.featured || false,
      weight: createProductDto.weight,
      dimensions: createProductDto.dimensions || {},
      tags: createProductDto.tags || [],
      seoTitle: createProductDto.seoTitle,
      seoDescription: createProductDto.seoDescription,
      metaKeywords: createProductDto.metaKeywords || [],
      warranty: createProductDto.warranty,
      specifications: createProductDto.specifications || {},
      faqData: createProductDto.faqData || [],
      videoUrl: createProductDto.videoUrl,
      manualUrl: createProductDto.manualUrl,
      minOrderQty: createProductDto.minOrderQty || 1,
      maxOrderQty: createProductDto.maxOrderQty,
      isBundle: createProductDto.isBundle || false,
    });

    return product;
  }

  // ------------------------------- Update Product -------------------------------
  public async updateProduct(updateProductDto: UpdateProductDto) {
    const { id, slug } = updateProductDto;

    // Check if product exists
    const existingProduct = await this.productRepository.findById(id);

    if (!existingProduct) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    // If slug is being updated, check if it's already in use
    if (slug && slug !== existingProduct.slug) {
      const slugExists = await this.productRepository.findBySlugExcludingId(
        slug,
        id,
      );

      if (slugExists) {
        throw new HttpException(
          'Product with this slug already exists',
          HttpStatus.CONFLICT,
        );
      }
    }

    const product = await this.productRepository.update(id, {
      name: updateProductDto.name,
      slug: updateProductDto.slug,
      shortDescription: updateProductDto.shortDescription,
      fullDescription: updateProductDto.fullDescription,
      brand: updateProductDto.brandId
        ? { connect: { id: updateProductDto.brandId } }
        : undefined,
      category: updateProductDto.categoryId
        ? { connect: { id: updateProductDto.categoryId } }
        : undefined,
      status: updateProductDto.status,
      featured: updateProductDto.featured,
      weight: updateProductDto.weight,
      dimensions: updateProductDto.dimensions,
      tags: updateProductDto.tags,
      seoTitle: updateProductDto.seoTitle,
      seoDescription: updateProductDto.seoDescription,
      metaKeywords: updateProductDto.metaKeywords,
      warranty: updateProductDto.warranty,
      specifications: updateProductDto.specifications,
      faqData: updateProductDto.faqData,
      videoUrl: updateProductDto.videoUrl,
      manualUrl: updateProductDto.manualUrl,
      minOrderQty: updateProductDto.minOrderQty,
      maxOrderQty: updateProductDto.maxOrderQty,
      isBundle: updateProductDto.isBundle,
    });

    return product;
  }

  // ------------------------------- Delete Product -------------------------------
  public async deleteProduct(id: string) {
    // Check if product exists
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    // Soft delete by setting status to DISCONTINUED
    const deletedProduct = await this.productRepository.softDelete(id);

    return deletedProduct;
  }
}
