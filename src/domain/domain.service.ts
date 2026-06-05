import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { DomainDto, UpdateDomainDto } from './dto/domain.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DomainService {
    constructor(private prisma: PrismaService) {}

    async create(dto: DomainDto) {

        const existingDomain = await this.prisma.emailDomain.findUnique({
            where: { domain: dto.domain }
        });

        if (existingDomain) {
            throw new ConflictException('Domain already exists');
        }

        return this.prisma.emailDomain.create({
            data: {
                domain: dto.domain,
                universityId: dto.universityId
            }
        });
    }

    async findAll() {
        return await this.prisma.emailDomain.findMany();
    }

    async find(id: string) {
        const domain = await this.prisma.emailDomain.findUnique({ where: { id } });
        if(!domain) throw new NotFoundException("Domain not found");
        return domain;
    }

    async update(id: string, dto: UpdateDomainDto) {
        if(dto.domain) {
            const existingDomain = await this.prisma.emailDomain.findFirst({ where: { domain: dto.domain, NOT: { id }} });
            if(existingDomain) throw new ConflictException("Domain already in use");
        }
        
        return await this.prisma.emailDomain.update({ where: { id }, data: dto });
    }

    async delete(id: string) {
        const domain = await this.prisma.emailDomain.findUnique({ where: { id } });
        if(!domain) throw new ConflictException("Domain not found");

        await this.prisma.emailDomain.delete({ where: { id } });
        return { msg: "Domain deleted successfully" }
    }

    async validateEmail(email: string) {
        const domain = email.split('@')[1];

        return await this.prisma.emailDomain.findUnique({
            where: { domain },
            include: { university: true }
        });
    }
}