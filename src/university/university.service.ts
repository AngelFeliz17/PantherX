import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UniversityDto, UpdateUniversityDto } from './dto';

@Injectable()
export class UniversityService {
    constructor(private prisma: PrismaService) {}

    async create(dto: UniversityDto) {
        const existingUniversity = await this.prisma.university.findUnique({ where: { name: dto.name } });
        if(existingUniversity) throw new ConflictException("University already exists");

        const addUniversity = await this.prisma.university.create({
            data: {
                name: dto.name
            }
        });
        return addUniversity;
    }

    async findAll() {
        return await this.prisma.university.findMany();
    }

    async update(dto: UpdateUniversityDto, id: string) {
        const existingUniversity = await this.prisma.university.findFirst({ where: { name: dto.name, NOT: { id } } });
        if(existingUniversity) throw new ConflictException("University already exists");

        const updateUniversity = await this.prisma.university.update({ where: { id }, data: dto })
        return updateUniversity;
    }

    async delete(id: string) {
        await this.prisma.university.delete({ where: { id: id } })        
        return { message: "University deleted successfully" };
    }
}
