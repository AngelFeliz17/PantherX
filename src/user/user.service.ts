import { BadRequestException, ConflictException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { User } from 'generated/prisma/browser';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoleDto, UpdateUserDto } from './dto';
import { EmailService } from 'src/email/email.service';
import { CloudinaryService } from '@/cloudinary/cloudinary.service';
import { CloudinaryUploadResult } from '@/cloudinary/interface';
 
@Injectable()
export class UserService {
    constructor(private prisma: PrismaService, private emailService: EmailService, private cloudinaryService: CloudinaryService ) {}

    async findAll() {
        const users = await this.prisma.user.findMany({ omit: { password: true } });
        return users;
    }

    async find(id: string) {
        const user = await this.prisma.user.findUnique({ where: { id }, omit: { password: true } });
        if(!user) throw new NotFoundException("User not found");
        return user;
    }

    async updateRole(id: string, dto: RoleDto) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if(!user) throw new ForbiddenException("User not found");

        const update = await this.prisma.user.update({ where: { id }, data: {
            role: dto.role
        }, omit: { password: true } });
        return update;
    }
    
    async update(user: User, dto: UpdateUserDto) {
        if(dto.email) {
            const existingUser = await this.prisma.user.findFirst({ where: { email: dto.email, NOT: { id: user.id }} });
            if(existingUser) throw new ConflictException("Email already in use");
        }
        
        const userData = await this.prisma.user.update({ where: { id: user.id}, data: dto, omit: { password: true } });
        return { userData, message: "User updated successfully" }
    }

    async updateProfilePicture(user: User, file: Express.Multer.File) {
        const existingAvatar = await this.prisma.profilePicture.findUnique({ where: { userId: user.id } });
        if(existingAvatar) {
            await this.cloudinaryService.deleteImage(existingAvatar.publicId);
        }
        if(!file) throw new BadRequestException("An image has to be uploaded");

        const { secure_url, public_id } = await this.cloudinaryService.uploadProfilePicture(file) as CloudinaryUploadResult;

        await this.prisma.profilePicture.upsert({ where: { userId: user.id }, update: { url: secure_url, publicId: public_id,
        }, create: { userId: user.id, url: secure_url, publicId: public_id } });
    }
    
    async updateProfileBanner(user: User, file: Express.Multer.File) {
        console.log(file)
        const existingBanner = await this.prisma.profileBanner.findUnique({ where: { userId: user.id } });
        if(existingBanner) {
            await this.cloudinaryService.deleteImage(existingBanner.publicId);
        }
        if(!file) throw new BadRequestException("An image has to be uploaded");

        try {
            const { secure_url, public_id } = await this.cloudinaryService.uploadProfileBanner(file) as CloudinaryUploadResult;
            await this.prisma.profileBanner.upsert({ where: { userId: user.id }, update: { url: secure_url, publicId: public_id,
        }, create: { userId: user.id, url: secure_url, publicId: public_id } });
        } catch (error) {
          console.log(error)  
        }
    }

    private async deleteUserListing (id: string) {
        // When a user delete the listing status is called ARCHIVED, but when the user has been deleted, it is status is REMOVED. This is done to not bring back deleted listing if the user gets restore again.
        await this.prisma.$transaction([ 
            this.prisma.user.update({ 
                where: { id }, 
                data: { deletedAt: new Date() } 
            }),
            this.prisma.listing.updateMany({ 
                where: { sellerId: id, status: { not: "ARCHIVED" } }, 
                data: { deletedAt: new Date(), status: 'REMOVED' } 
            })
        ]);
    }

    async delete(user: User) {
        try {
            // Delete user and their listings
            await this.deleteUserListing(user.id);
            await this.emailService.sendOnDeleteAccountEmail(user.email);

            return { message: "User deleted successfully" };
        } catch (error) {
            console.error(error)
            throw new InternalServerErrorException('Failed to delete user');
        }
    }

    async deleteUser(id: string) {
        try {
            await this.deleteUserListing(id)

            return { message: "User deleted successfully" };
        } catch (error) {
            console.error(error)
            throw new InternalServerErrorException('Failed to delete user');
        }
    }

    async restore(id: string) {
        try {
            const user = await this.prisma.user.findUnique({ where: { id } });
            if(!user) throw new NotFoundException('User not found');

            // Restore user and their listings
            const restore = await this.prisma.$transaction([
                this.prisma.user.update({ where: { id }, data: { deletedAt: null }, omit: { password: true } }),
                this.prisma.listing.updateMany({ where: { status: "REMOVED" }, data: { deletedAt: null, status: 'ACTIVE' } })
            ]);
            
            await this.emailService.sendOnRestoreAccountEmail(user.email);

            return restore;
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            console.error(error)
            throw new InternalServerErrorException('Failed to restore user');
        }
    }
}
