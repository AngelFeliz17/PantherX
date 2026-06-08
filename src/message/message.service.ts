import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessageDto } from './dto';

@Injectable()
export class MessageService {
    constructor(private prismaService: PrismaService) {}

    async send(user: User, conversationId: string, dto: MessageDto) {
        const conversation = await this.prismaService.conversation.findUnique({
            where: { id: conversationId },
            include: {
                listing: true,
            },
        });
        if (!conversation) throw new NotFoundException('Conversation not found');

        const isBuyer = conversation.buyerId === user.id;
        const isSeller = conversation.listing.sellerId === user.id;
        
        if(!isBuyer && !isSeller) throw new ForbiddenException('You are not a member of this conversation');

        const message = await this.prismaService.message.create({ data: {
            content: dto.content,
            senderId: user.id,
            conversationId
        } });

        await this.prismaService.conversation.update({
            where: { id: conversationId },
            data: {}
        })
        return message;
    }
}
