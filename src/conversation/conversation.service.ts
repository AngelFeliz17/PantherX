import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ConversationService {
    constructor(private prismaService: PrismaService) {}

    async start(buyer: User, listingId: string) {
        const listing = await this.prismaService.listing.findFirst({ where: { id: listingId, deletedAt: null } });
        if(!listing) throw new NotFoundException('Listing not found');
        if(listing.sellerId === buyer.id) throw new BadRequestException("You cannot start a conversation with your own listing");
        
        return await this.prismaService.conversation.upsert({ where: { listingId_buyerId: { buyerId: buyer.id, listingId } }, create: { buyerId: buyer.id, listingId }, update: {}, include: { listing: { select: { id: true, title: true, price: true, seller: { select: { id: true, firstName: true, lastName: true, profilePicture: true } }} } } });
    }
}
