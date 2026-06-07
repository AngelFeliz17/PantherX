import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavoritesService {
    constructor(private prismaService: PrismaService) {}

    async add(user: User, listingId: string) {
        const listing = await this.prismaService.listing.findFirst({ where: { id: listingId, deletedAt: null, sellerId: { not: user.id } } });

        if(!listing) throw new BadRequestException('Listing not found');

        const existingFavorite = await this.prismaService.favorite.findUnique({
            where: {
                listingId_userId: {
                listingId,
                userId: user.id,
                },
            },
        });

        if (existingFavorite) {
            throw new BadRequestException('Listing already in favorites');
        }
        
        await this.prismaService.favorite.create({ data: {
            userId: user.id,
            listingId
        } });

        return { message: "Listing added to your favorites" }
    }

    async delete(user: User, listingId: string) {
        const listing = await this.prismaService.listing.findUnique({ where: { id: listingId, deletedAt: null, sellerId: { not: user.id } } });

        if(!listing) throw new BadRequestException('Listing not found');

        await this.prismaService.favorite.delete({ where: {
            listingId_userId: { userId: user.id,
            listingId }
        } });

        return { message: "Listing deleted from your favorites" }
    }

    async find(user: User) {
        const favorites = await this.prismaService.favorite.findMany({ where: { userId: user.id, listing: { deletedAt: null } }, include: { listing: true } });

        return favorites;
    }


}
