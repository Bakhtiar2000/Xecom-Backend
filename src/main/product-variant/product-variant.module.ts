import { Module } from '@nestjs/common';
import { ProductVariantController } from './product-variant.controller';
import { ProductVariantService } from './product-variant.service';
import { ProductVariantRepository } from './product-variant.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ProductVariantController],
  providers: [ProductVariantService, ProductVariantRepository],
  exports: [ProductVariantService],
})
export class ProductVariantModule {}
