import { Module } from '@nestjs/common';
import { ThanaService } from './thana.service';
import { ThanaController } from './thana.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [AuthModule],
    controllers: [ThanaController],
    providers: [ThanaService],
})
export class ThanaModule { }