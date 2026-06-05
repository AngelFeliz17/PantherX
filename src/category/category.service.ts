import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CategoryDto, UpdateCategoryDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
    constructor(private prisma: PrismaService) {}

    async create(dto: CategoryDto) {
        const existingCategory = await this.prisma.category.findFirst({ where: { name: dto.name } });
        if(existingCategory) throw new ConflictException("Existing category");

        return await this.prisma.category.create({ data: dto });
    }

    async findAll() {
        return await this.prisma.category.findMany();
    }

    async find(id: string) {
        const category = await this.prisma.category.findUnique({ where: { id } });
        if(!category) throw new NotFoundException("Category not found");

        return category;
    }

    async update(id: string, dto: UpdateCategoryDto) {
        const existingCategory = await this.prisma.category.findUnique({ where: { name: dto.name, NOT: { id } } });
        if(existingCategory) throw new ConflictException("Existing category");

        return this.prisma.category.update({ where: { id }, data: dto});
    }

    async delete(id: string) {
        const existingCategory = await this.prisma.category.findUnique({ where: { id } });
        if(!existingCategory) throw new NotFoundException("Category not found");

        await this.prisma.category.delete({ where: { id } });
        return { message: "Category deleted successfully" };
    }
}