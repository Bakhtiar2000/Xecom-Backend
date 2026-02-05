import { Module } from '@nestjs/common';
import { DivisionService } from './division.service';
import { DivisionController } from './division.controller';
import { DivisionRepository } from './division.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [DivisionController],
  providers: [DivisionService, DivisionRepository],
})
export class DivisionModule {}
