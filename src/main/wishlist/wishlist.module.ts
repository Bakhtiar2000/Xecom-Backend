import { Module } from '@nestjs/common';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';
import { WishlistRepository } from './wishlist.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [AuthModule],
    controllers: [WishlistController],
    providers: [WishlistService, WishlistRepository],
    exports: [WishlistService],
})
export class WishlistModule { }
