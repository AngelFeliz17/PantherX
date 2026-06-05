import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ListingDto } from './dto';
import { User } from 'generated/prisma/browser';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class ListingService {
    constructor(private prisma: PrismaService, private cloudinaryService: CloudinaryService) {}

    async create(dto: ListingDto, seller: User, files: Express.Multer.File[]) {
        const category = await this.prisma.category.findUnique({ where: { id: dto.categoryId } });
        if (!category) throw new NotFoundException('Category not found');

        const uploadedImages = await Promise.all(
            files.map(file =>
                this.cloudinaryService.uploadListingImg(file),
            ),
        );
        return await this.prisma.listing.create({ data: { ...dto,  sellerId: seller.id, images: { create: uploadedImages.map((img: any, idx) => ({
            url: img.secure_url,
            order: idx
        })) } }, include: { category: true, seller: { select: { id: true, firstName: true, lastName: true, profilePicture: true } } } })
    }
}
