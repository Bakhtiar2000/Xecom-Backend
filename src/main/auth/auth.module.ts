/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerService } from 'src/utils/sendMail';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthGuard } from 'src/guard/auth.guard';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('ACCESS_SECRET'),
        signOptions: {
          expiresIn: config.get<number>('ACCESS_SECRET_EXPIRES_IN'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, ConfigService, MailerService, AuthGuard],
  exports: [AuthGuard, JwtModule],
})
export class AuthModule {}
