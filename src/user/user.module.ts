import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EmailModule } from 'src/email/email.module';
import { EmailService } from 'src/email/email.service';
import { CloudinaryService } from '@/cloudinary/cloudinary.service';
import { CloudinaryModule } from '@/cloudinary/cloudinary.module';

@Module({
  imports: [PrismaModule, EmailModule, CloudinaryModule],
  providers: [UserService, EmailService, CloudinaryService],
  controllers: [UserController]
})
export class UserModule {}
