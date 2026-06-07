import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { GetUser } from 'src/auth/decorator';
import type { User } from 'generated/prisma/client';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('favorites')
export class FavoritesController {
    constructor(private favoritesService: FavoritesService){}

    @Post(':listingId')
    add(@GetUser() user: User, @Param('listingId') listingId: string) {
        return this.favoritesService.add(user, listingId);
    }

    @Delete(':listingId')
    delete(@GetUser() user: User, @Param('listingId') listingId: string) {
        return this.favoritesService.delete(user, listingId);
    }

    @Get()
    find(@GetUser() user: User) {
        return this.favoritesService.find(user);
    }

}
