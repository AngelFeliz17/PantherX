import { ConflictException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User, UserRole } from 'generated/prisma/browser';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoleDto, UpdateUserDto } from './dto';
 
@Injectable()
export class UserService {
    constructor(private prisma: PrismaService ) {}

    async findAll() {
        const users = await this.prisma.user.findMany();
        return users;
    }

    async find(id: string) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if(!user) throw new NotFoundException("User not found");
        return user;
    }

    async updateRole(id: string, dto: RoleDto) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if(!user) throw new ForbiddenException("User not found");

        const update = await this.prisma.user.update({ where: { id }, data: {
            role: dto.role
        } });
        return update;
    }
    
    async update(user: User, dto: UpdateUserDto) {
        if(dto.email) {
            const existingUser = await this.prisma.user.findFirst({ where: { email: dto.email, NOT: { id: user.id }} });
            if(existingUser) throw new ConflictException("Email already in use");
        }
        
        return await this.prisma.user.update({ where: { id: user.id}, data: dto });
    }

    async delete(user: User) {
        try {
            await this.prisma.user.delete({ where: { id: user.id } });

            return { msg: "User deleted successfully" };
        } catch (error) {
            console.error(error)
            throw new InternalServerErrorException('Failed to delete user');
        }
    }
}
