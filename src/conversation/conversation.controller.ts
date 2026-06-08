import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import type { User } from 'generated/prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { ConversationService } from './conversation.service';

@UseGuards(JwtGuard)
@Controller('conversations')
export class ConversationController {
    constructor(private conversationService: ConversationService) {}

    @Post(':listingId')
    start(@GetUser() buyer: User, @Param('listingId') listingId: string) {
        return this.conversationService.start(buyer, listingId);
    }
}