import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { v2 as cloudinaryListing, v2 as cloudinaryAvatar } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { rejects } from 'assert';

@Injectable()
export class CloudinaryService {
    constructor(private config: ConfigService) {
        cloudinaryListing.config({
            cloud_name: config.get("CLOUDINARY_NAME"),
            api_key: config.get("CLOUDINARY_LISTING_API_KEY"),
            api_secret: config.get("CLOUDINARY_LISTING_API_SECRET"),
        })
    }

    async uploadListingImg(file: Express.Multer.File) {
        return new Promise((resolve, reject) => cloudinaryListing.uploader.upload_stream( { folder: this.config.get("CLOUDINARY_LISTING_FOLDER_NAME") }, (error, result) => {
                if(error) return reject(error);
                resolve(result);
        }).end(file.buffer))
    }
}
