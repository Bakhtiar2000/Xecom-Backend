import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepository } from './product.repository';
import { AuthModule } from '../auth/auth.module';
import { LibModule } from 'src/lib/lib.module';
import { BrandRepository } from '../brand/brand.repository';
import { CategoryRepository } from '../category/category.repository';

@Module({
  imports: [AuthModule, LibModule],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository, BrandRepository, CategoryRepository],
  exports: [ProductService, ProductRepository],
})
export class ProductModule { }
