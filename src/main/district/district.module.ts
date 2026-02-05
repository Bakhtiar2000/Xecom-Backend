import { Module } from '@nestjs/common';
import { DistrictService } from './district.service';
import { DistrictController } from './district.controller';
import { DistrictRepository } from './district.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [DistrictController],
  providers: [DistrictService, DistrictRepository],
})
export class DistrictModule {}
