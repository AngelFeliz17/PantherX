import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ListingDto, UpdateListingDto } from './dto';
import { User } from 'generated/prisma/browser';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CloudinaryUploadResult } from 'src/cloudinary/interface';

@Injectable()
export class ListingService {
    constructor(private prisma: PrismaService, private cloudinaryService: CloudinaryService) {}

    async create(dto: ListingDto, seller: User, files: Express.Multer.File[]) {
        if(!files?.length) throw new BadRequestException("At least 1 image is required");

        const category = await this.prisma.category.findUnique({ where: { id: dto.categoryId } });
        if (!category) throw new NotFoundException('Category not found');

        let images;
        try {
            images = await this.uploadImages(files);
            const data = await this.prisma.listing.create({ data: { ...dto,  sellerId: seller.id, images: { create: images.map((img, idx) => ({
                url: img.secure_url,
                order: idx,
                publicId: img.public_id
            })) } } } );
            return { message: "Listing created successfully", data }
       } catch(error) {
            await Promise.all(
                images.map(img => this.cloudinaryService.deleteImage(img.public_id))
            )
            console.log(error)
            throw error;
       }
    }

    private async uploadImages(files: Express.Multer.File[]) {
       const uploadedImages: CloudinaryUploadResult[] = []; 
        for(const file of files){ 
            const result = await this.cloudinaryService.uploadListingImg(file) as CloudinaryUploadResult;
            uploadedImages.push(result)
        };

        return uploadedImages;
    }

    async findMy(user: User) {
        const listings = await this.prisma.listing.findMany({ where: { sellerId: user.id, deletedAt: null }, include: { seller: { omit: { password: true } }, category: true, images: true } });

        return listings;
    }

    async findAll() {
        return await this.prisma.listing.findMany({ where: { deletedAt: null, seller: { deletedAt: null, suspended: false } }, include: { images: { orderBy: { order: 'asc' } }, seller: { select: { id: true, name: true } } } });
    }

    async find(id: string) {
        const listing = await this.prisma.listing.findFirst({ where: { id, deletedAt: null }, include: { seller: { omit: { password: true }, include: { profilePicture: true } }, category: true, images: true } });
        if(!listing) throw new NotFoundException("Listing not found");

        return listing;
    }

    async update(id: string, dto: UpdateListingDto, files: Express.Multer.File[]) {
        const listing = await this.prisma.listing.findFirst({ where: { id, deletedAt: null }, include: { images: true } });
        if(!listing) throw new NotFoundException("Listing not found")

        const { existingImageIds, ...rest } = dto;
        const keptIds = existingImageIds ?? listing.images.map(img => img.id);
        const keptIdSet = new Set(keptIds);
        const imagesToDelete = listing.images.filter(img => !keptIdSet.has(img.id));

        const uploadedFiles = files ?? [];
        if (keptIds.length + uploadedFiles.length === 0) {
            throw new BadRequestException("A listing must have at least one image");
        }

        let uploaded: CloudinaryUploadResult[] = [];
        try {
            if (uploadedFiles.length) {
                uploaded = await this.uploadImages(uploadedFiles);
            }

            await this.prisma.$transaction(async (tx) => {
                // Shift existing orders out of the way first so reassigning them
                // below can't collide with the @@unique([listingId, order]) constraint.
                await tx.listingImage.updateMany({
                    where: { listingId: id },
                    data: { order: { increment: keptIds.length + uploaded.length } },
                });

                for (const [idx, imageId] of keptIds.entries()) {
                    await tx.listingImage.update({ where: { id: imageId }, data: { order: idx } });
                }

                if (imagesToDelete.length) {
                    await tx.listingImage.deleteMany({ where: { id: { in: imagesToDelete.map(img => img.id) } } });
                }

                if (uploaded.length) {
                    await tx.listingImage.createMany({
                        data: uploaded.map((img, idx) => ({
                            listingId: id,
                            url: img.secure_url,
                            order: keptIds.length + idx,
                            publicId: img.public_id,
                        })),
                    });
                }

                await tx.listing.update({ where: { id }, data: rest });
            });
        } catch(error) {
            await Promise.all(uploaded.map(img => this.cloudinaryService.deleteImage(img.public_id)));
            console.error(error);
            throw error;
        }

        await Promise.all(imagesToDelete.map(img => this.cloudinaryService.deleteImage(img.publicId)));

        return this.find(id);
    }

    async removeImage(id: string) {
        const image = await this.prisma.listingImage.findUnique({ where: { id }, include: { listing: { include: { images: true } } } });

        if(!image) throw new NotFoundException("Image not found");
        if(image.listing.images.length <= 1) throw new BadRequestException("A listing must have at least one image");

        await this.cloudinaryService.deleteImage(image.publicId);

        await this.prisma.listingImage.delete({ where: { id: image.id } })
    }

    async delete(id: string) {
        const listing = await this.prisma.listing.findFirst({ where: { id, deletedAt: null }, include: { images: true } });
        if(!listing) throw new NotFoundException("Listing not found");

        await this.prisma.listing.update({
            where: { id },
            data: { deletedAt: new Date(), status: "ARCHIVED" }
        });
    }

    async permanentlyDelete(id: string) {
        const listing = await this.prisma.listing.findUnique({
            where: { id },
            include: { images: true },
        });

        if (!listing) {
            throw new NotFoundException("Listing not found");
        }

        await Promise.all(
            listing.images.map(img =>
                this.cloudinaryService.deleteImage(img.publicId),
            ),
        );

        await this.prisma.listing.delete({
            where: { id },
        });
    }
}
