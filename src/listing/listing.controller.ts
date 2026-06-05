import { Body, Controller, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ListingService } from './listing.service';
import { JwtGuard } from 'src/auth/guard';
import { ListingDto } from './dto';
import { GetUser } from 'src/auth/decorator';
import type { User } from 'generated/prisma/client';
import { VerifiedGuard } from 'src/user/guard/verified.guard';
import { FilesInterceptor } from '@nestjs/platform-express';

@UseGuards(JwtGuard, VerifiedGuard)
@Controller('listings')
export class ListingController {
    constructor(private listingService: ListingService) {}

    @Post()
    @UseInterceptors(FilesInterceptor('images', 10))
    create(@Body() dto: ListingDto, @GetUser() seller: User, @UploadedFiles() files: Express.Multer.File[]) {
        return this.listingService.create(dto, seller, files);
    }
}
