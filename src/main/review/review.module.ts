import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { ReviewRepository } from './review.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [AuthModule],
    controllers: [ReviewController],
    providers: [ReviewService, ReviewRepository],
    exports: [ReviewService],
})
export class ReviewModule { }
