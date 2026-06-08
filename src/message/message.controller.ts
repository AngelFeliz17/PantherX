import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import type { User } from 'generated/prisma/client';
import { GetUser } from 'src/auth/decorator';
import { MessageService } from './message.service';
import { MessageDto } from './dto';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('messages')
export class MessageController {
    constructor(private messageService: MessageService) {}

    @Post(':conversationId')
    send(@GetUser() user: User, @Param('conversationId') conversationId: string, @Body() dto: MessageDto) {
        return this.messageService.send(user, conversationId, dto);
    }
}