import { Module } from '@nestjs/common';
import { ThanaService } from './thana.service';
import { ThanaController } from './thana.controller';

@Module({
    controllers: [ThanaController],
    providers: [ThanaService],
})
export class ThanaModule { }