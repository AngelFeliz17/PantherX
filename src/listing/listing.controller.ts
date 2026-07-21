import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ListingService } from './listing.service';
import { JwtGuard } from 'src/auth/guard';
import { ListingDto, UpdateListingDto } from './dto';
import { GetUser } from 'src/auth/decorator';
import type { User } from 'generated/prisma/client';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AdminGuard } from 'src/user/guard';

@Controller('listings')
export class ListingController {
    constructor(private listingService: ListingService) {}

    @UseGuards(JwtGuard)
    @Post()
    @UseInterceptors(FilesInterceptor('images', 10))
    create(@Body() dto: ListingDto, @GetUser() seller: User, @UploadedFiles() files: Express.Multer.File[]) {
        return this.listingService.create(dto, seller, files);
    }

    @Get()
    findAll() {
        return this.listingService.findAll();
    }

    @Get(':id')
    find(@Param('id') id: string) {
        return this.listingService.find(id);
    }

    @UseGuards(JwtGuard)
    @Get('my')
    findMy(@GetUser() user: User) {
        return this.listingService.findMy(user);
    }

    @UseGuards(JwtGuard)
    @Patch(':id')
    @UseInterceptors(FilesInterceptor('images', 10))
    update(@Param('id') id: string, @Body() dto: UpdateListingDto, @UploadedFiles() files: Express.Multer.File[]) {
        return this.listingService.update(id, dto, files);
    }

    @UseGuards(JwtGuard)
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.listingService.delete(id);
    }

    @UseGuards(JwtGuard)
    @Delete('image/:id')
    removeImage(@Param('id') id: string) {
        return this.listingService.removeImage(id);
    }

    @UseGuards(AdminGuard)
    @UseGuards(JwtGuard)
    @Delete('permanently/:id')
    permanentlyDelete(@Param('id') id: string) {
        return this.listingService.permanentlyDelete(id);
    }
}
