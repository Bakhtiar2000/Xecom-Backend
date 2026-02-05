import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProductVariantRepository } from './product-variant.repository';
import {
  CreateProductVariantDto,
  UpdateProductVariantDto,
} from './product-variant.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductVariantService {
  constructor(
    private readonly productVariantRepository: ProductVariantRepository,
    private readonly prisma: PrismaService,
  ) {}

  // ------------------------------- Get All Product Variants -------------------------------
  public async getAllProductVariantsByProductId(productId: string) {
    // Check if product exists
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    const variants =
      await this.productVariantRepository.findAllByProductId(productId);
    return variants;
  }

  // ------------------------------- Add Product Variant -------------------------------
  public async addProductVariant(
    createProductVariantDto: CreateProductVariantDto,
  ) {
    const { productId, sku, attributeValueIds } = createProductVariantDto;

    // Check if product exists
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    // Check if SKU already exists
    const existingSku = await this.productVariantRepository.findBySku(sku);

    if (existingSku) {
      throw new HttpException(
        'Product variant with this SKU already exists',
        HttpStatus.CONFLICT,
      );
    }

    // Create the variant
    const variant = await this.productVariantRepository.create({
      product: {
        connect: { id: productId },
      },
      sku,
      price: createProductVariantDto.price,
      cost: createProductVariantDto.cost,
      stockQuantity: createProductVariantDto.stockQuantity,
      stockAlertThreshold: createProductVariantDto.stockAlertThreshold || 5,
      isDefault: createProductVariantDto.isDefault || false,
    });

    // Add attribute values if provided
    if (attributeValueIds && attributeValueIds.length > 0) {
      for (const attributeValueId of attributeValueIds) {
        await this.productVariantRepository.createVariantAttribute(
          variant.id,
          attributeValueId,
        );
      }
    }

    // Fetch the updated variant with attributes
    const updatedVariant = await this.productVariantRepository.findById(
      variant.id,
    );

    return updatedVariant;
  }

  // ------------------------------- Update Product Variant -------------------------------
  public async updateProductVariant(
    updateProductVariantDto: UpdateProductVariantDto,
  ) {
    const { id, sku, attributeValueIds } = updateProductVariantDto;

    // Check if variant exists
    const existingVariant = await this.productVariantRepository.findById(id);

    if (!existingVariant) {
      throw new HttpException(
        'Product variant not found',
        HttpStatus.NOT_FOUND,
      );
    }

    // If SKU is being updated, check if it's already in use
    if (sku && sku !== existingVariant.sku) {
      const skuExists =
        await this.productVariantRepository.findBySkuExcludingId(sku, id);

      if (skuExists) {
        throw new HttpException(
          'Product variant with this SKU already exists',
          HttpStatus.CONFLICT,
        );
      }
    }

    // Update the variant
    const variant = await this.productVariantRepository.update(id, {
      sku: updateProductVariantDto.sku,
      price: updateProductVariantDto.price,
      cost: updateProductVariantDto.cost,
      stockQuantity: updateProductVariantDto.stockQuantity,
      stockAlertThreshold: updateProductVariantDto.stockAlertThreshold,
      isDefault: updateProductVariantDto.isDefault,
    });

    // Update attribute values if provided
    if (attributeValueIds) {
      // Delete existing attribute associations
      await this.productVariantRepository.deleteVariantAttributes(id);

      // Add new attribute values
      for (const attributeValueId of attributeValueIds) {
        await this.productVariantRepository.createVariantAttribute(
          id,
          attributeValueId,
        );
      }
    }

    // Fetch the updated variant with attributes
    const updatedVariant = await this.productVariantRepository.findById(id);

    return updatedVariant;
  }

  // ------------------------------- Delete Product Variant -------------------------------
  public async deleteProductVariant(id: string) {
    // Check if variant exists
    const variant = await this.productVariantRepository.findById(id);

    if (!variant) {
      throw new HttpException(
        'Product variant not found',
        HttpStatus.NOT_FOUND,
      );
    }

    const deletedVariant = await this.productVariantRepository.delete(id);

    return deletedVariant;
  }
}
