import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UniversityService } from './university.service';
import { UniversityDto, UpdateUniversityDto } from './dto';
import { GetUser } from 'src/auth/decorator';
import type { User } from 'generated/prisma/client';
import { JwtGuard } from 'src/auth/guard';
import { AdminGuard } from '../user/guard/admin.guard';

@Controller('universities')
export class UniversityController {
    constructor(private universityService: UniversityService) {}
    
    @UseGuards(JwtGuard, AdminGuard)
    @Post()
    async create(@Body() dto: UniversityDto) {
        return this.universityService.create(dto);
    }

    @Get()
    async findAll() {
        return this.universityService.findAll();
    }
    
    @UseGuards(JwtGuard, AdminGuard)
    @Patch(':id')
    async update(@Body() dto: UpdateUniversityDto, @Param('id') id: string) {
        return this.universityService.update(dto, id);
    }

    @UseGuards(JwtGuard, AdminGuard)
    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.universityService.delete(id);
    }

}
