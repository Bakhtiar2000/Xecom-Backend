import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { BrandRepository } from './brand.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [BrandController],
  providers: [BrandService, BrandRepository],
  exports: [BrandService],
})
export class BrandModule {}
