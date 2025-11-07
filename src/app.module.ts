import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { LibModule } from './lib/lib.module';
import { UserModule } from './main/user/user.module';
import { AuthModule } from './main/auth/auth.module';
import { AdminModule } from './main/admin/admin.module';
import { StaffModule } from './main/staff/staff.module';
import { CustomerModule } from './main/customer/customer.module';
import { CountryModule } from './main/country/country.module';
import { DivisionModule } from './main/division/division.module';
import { DistrictModule } from './main/district/district.module';
import { ThanaModule } from './main/thana/thana.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LibModule,
    PrismaModule,
    UserModule,
    AuthModule,
    AdminModule,
    StaffModule,
    CustomerModule,
    CountryModule,
    DivisionModule,
    DistrictModule,
    ThanaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
