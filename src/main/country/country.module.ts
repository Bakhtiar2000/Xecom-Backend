import { Module } from '@nestjs/common';
import { CountryService } from './country.service';
import { CountryController } from './country.controller';
import { CountryRepository } from './country.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [CountryController],
  providers: [CountryService, CountryRepository],
})
export class CountryModule {}
