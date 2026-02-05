import { Module } from '@nestjs/common';
import { ThanaService } from './thana.service';
import { ThanaController } from './thana.controller';
import { ThanaRepository } from './thana.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ThanaController],
  providers: [ThanaService, ThanaRepository],
})
export class ThanaModule {}
