import { Module } from '@nestjs/common';
import { ProductRelationController } from './product-relation.controller';
import { ProductRelationService } from './product-relation.service';
import { ProductRelationRepository } from './product-relation.repository';
import { ProductRepository } from '../product/product.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ProductRelationController],
  providers: [
    ProductRelationService,
    ProductRelationRepository,
    ProductRepository,
  ],
  exports: [ProductRelationService],
})
export class ProductRelationModule {}
