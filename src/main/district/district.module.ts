import { Module } from '@nestjs/common';
import { DistrictService } from './district.service';
import { DistrictController } from './district.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
     imports: [AuthModule],
    controllers: [DistrictController],
    providers: [DistrictService],
})
export class DistrictModule { }